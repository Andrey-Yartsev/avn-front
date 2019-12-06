<template>
  <div class="container awards">
    <div class="awards-header" :class="{ gay: isGay }">
      <img
        :src="'/static/img/avnawards.png'"
        alt=""
        class="logo-awards"
        v-if="!isGay"
      />
      <GayLogo v-else />
    </div>
    <Banner v-if="!isVotingEnabled" :title="banner.title" :text="banner.text" />
    <template v-else>
      <template v-if="!categoriesLoading">
        <div class="select-block">
          <VueSelect
            :options="catOptions"
            v-model="currentCatOption"
            :clearable="false"
            :searchable="false"
            class="voting-select"
          />
          <div class="subtitle">Click on image to Vote</div>
        </div>

        <h2>Please choose your top {{ maxVotes }}</h2>
        <div>
          Voting end on Dec 1st 2019 12:00PM. You can cast
          {{ maxVotes }} votes per day for this category. You have
          {{ remaining }} votes remaining
        </div>
        <div class="title-block">
          <h1>{{ currentCategory ? currentCategory.title : "..." }}</h1>
          <button @click="nextCategory" class="btn">Next Category</button>
        </div>
      </template>

      <div class="models">
        <figure
          v-for="nominee in models"
          :key="nominee.id"
          :class="{
            voted: nominee.isVoted,
            disabled: nominee.disabled || votingInProgress
          }"
        >
          <div v-if="nominee.dummy" class="dummy"></div>
          <template v-else>
            <Loader
              v-if="voting(nominee.nomineeId)"
              :fullscreen="false"
              :inline="true"
              :small="true"
            />
            <div class="inner">
              <a class="button" @click="vote(nominee.nomineeId)" />
              <img
                :src="nominee.nominationAvatar"
                class="image"
                @click="vote(nominee.nomineeId)"
              />
              <div class="name-block">
                <div class="">{{ nominee.nominationName }}</div>
                <TwitterShare v-if="!twitterScriptLoading" :nominee="nominee" />
              </div>
            </div>
          </template>
        </figure>
      </div>
    </template>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
// import InfinityScroll from "@/mixins/infinityScroll";
import GayLogo from "../GayLogo";
import User from "@/mixins/user";
import Banner from "./Banner";
import TwitterShare from "./TwitterShare";
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  mixins: [
    // InfinityScroll,
    User
  ],
  components: {
    Loader,
    GayLogo,
    Banner,
    TwitterShare,
    VueSelect
  },
  data() {
    return {
      categoryId: 0,
      votes: [],
      maxVotes: 5,
      lastVoteId: 0,
      models: [],
      banner: {
        title: "Voting Not Open Yet!",
        text: "Voting has not begun yet but will open soon."
      },
      twitterScriptLoading: true,
      votingClickInProgress: false
    };
  },
  computed: {
    isGay() {
      return this.$route.meta.isGay;
    },
    eventId() {
      return this.isGay ? 92 : 91;
    },
    categories() {
      if (!this.$store.state.awards.categories) {
        return [];
      }
      return this.$store.state.awards.categories.data || [];
    },
    catOptions() {
      return this.categories.map(v => {
        return {
          label: v.title,
          code: v.id
        };
      });
    },
    currentCategory() {
      return this.categories.find(v => v.id === this.categoryId);
    },
    currentCatOption: {
      get() {
        return this.catOptions.find(v => v.code === this.categoryId);
      },
      set(option) {
        this.categoryId = option.code;
      }
    },
    nominees() {
      return this.$store.state.awards.nominees;
    },
    categoriesLoading() {
      return this.$store.state.awards.fetchCategoriesLoading;
    },
    modelsLoading() {
      return this.$store.state.awards._fetchNomineesLoading;
    },
    store() {
      return this.$store.state.awards;
    },
    remaining() {
      return this.maxVotes - this.votesCount;
    },
    votesCount() {
      return this.$store.state.awards.votesCount;
    },
    isVotingEnabled() {
      return (
        this.$store.state.init.data.enableVoting ||
        (this.user && this.user.adminReturnUrl) ||
        (this.user && this.user.showVote)
      );
    },
    votingInProgress() {
      return (
        this.$store.state.awards._voteLoading ||
        this.$store.state.awards._unvoteLoading
      );
    }
  },
  methods: {
    vote(id) {
      if (!this.user) {
        this.$store.dispatch("modal/show", {
          name: "login"
        });
        return;
      }

      if (this.votingInProgress) {
        return;
      }

      this.lastVoteId = id;
      const nominee = this.models.find(v => v.nomineeId === id);
      if (nominee.disabled) {
        return;
      }

      if (nominee.isVoted) {
        this.$store
          .dispatch("awards/unvote", {
            id,
            eventId: this.eventId,
            categoryId: this.categoryId,
            voteId: nominee.voteId,
            sentry: JSON.stringify(window.okev.all())
          })
          .then(() => {
            this.extendNominees();
          });
      } else {
        this.$store
          .dispatch("awards/vote", {
            id,
            eventId: this.eventId,
            categoryId: this.categoryId,
            sentry: JSON.stringify(window.okev.all())
          })
          .then(() => {
            this.extendNominees();
          });
      }
    },
    nextCategory() {
      const i = this.categories.findIndex(v => v.id === this.categoryId);
      if (this.categories[i + 1]) {
        this.categoryId = this.categories[i + 1].id;
      }
    },
    fetchNominees() {
      this.$store
        .dispatch("awards/fetchNominees", {
          eventId: this.eventId,
          categoryId: this.categoryId
        })
        .then(() => {
          this.extendNominees();
        });
    },
    voting(id) {
      if (id !== this.lastVoteId) {
        return false;
      }
      if (this.$store.state.awards._voteLoading) {
        return true;
      } else if (this.$store.state.awards._unvoteLoading) {
        return true;
      }
      return false;
    },
    extendNominees() {
      this.setDisabled();
      this.addDummies();
    },
    setDisabled() {
      if (this.votesCount >= this.maxVotes) {
        this.models = this.models.map(model => {
          if (!model.isVoted) {
            model.disabled = true;
          }
          return model;
        });
      } else {
        this.models = this.models.map(model => {
          model.disabled = false;
          return model;
        });
      }
    },
    addDummies() {
      const dummiesCount = 4 - (this.models.length % 4);
      if (dummiesCount) {
        for (let i = 0; i < dummiesCount; i++) {
          this.models.push({
            dummy: true
          });
        }
      }
    },
    // infinityScrollGetDataMethod() {
    //   this.fetchNominees();
    // },
    addTwitterLib() {
      let script = document.createElement("script");
      script.onload = () => {
        this.twitterScriptLoading = false;
      };
      script.async = true;
      script.src = "https://platform.twitter.com/widgets.js?" + Math.random();
      document.head.appendChild(script);
    }
  },
  watch: {
    categories(categories) {
      if (categories.length) {
        this.categoryId = categories[0].id;
      }
    },
    categoryId(id) {
      this.fetchNominees();

      const basePath = this.$route.path.replace(/(.*voting)(\/\d+)/, "$1");
      if (this.$route.path !== basePath + "/" + id) {
        this.$router.push(basePath + "/" + id);
      }

      // this.resetInfinityScroll();
    },
    nominees(nominees) {
      this.models = JSON.parse(JSON.stringify(nominees));
      this.extendNominees();
    }
  },
  created() {
    this.addTwitterLib();
  },
  mounted() {
    this.$store.dispatch("awards/fetchCategories", this.eventId);
    if (this.$route.params.category) {
      this.categoryId = this.$route.params.category;
    }
  }
};
</script>
