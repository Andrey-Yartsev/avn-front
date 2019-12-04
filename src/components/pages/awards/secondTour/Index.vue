<template>
  <div class="container awards">
    {{ { twitterScriptLoading } }}
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
      <select
        name="month"
        required="required"
        v-model="categoryId"
        class="select"
      >
        <option :value="v.id" v-for="v in categories" :key="v.id">{{
          v.title
        }}</option>
      </select>

      <template>
        <h2>Please choose your top {{ maxVotes }}</h2>
        <div>
          Voting end on Dec 1st 2019 12:00PM. You can cast {{ maxVotes }} votes
          per day for this category. You have {{ remaining }} votes remaining
        </div>
        <div class="title-block">
          <h1>Privacy Policy</h1>
          <button @click="nextCategory" class="btn">Next Category</button>
        </div>
        <div class="models">
          <Nominee
            v-for="v in models"
            :key="v.id"
            :nominee="v"
            :voting="voting(v.nomineeId)"
            :twitterScriptLoading="twitterScriptLoading"
            @vote="vote"
          />
        </div>
      </template>
      <Loader v-if="modelsLoading" />
    </template>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import InfinityScroll from "@/mixins/infinityScroll";
import GayLogo from "../GayLogo";
import User from "@/mixins/user";
import Banner from "./Banner";
import Nominee from "./Nominee";

export default {
  mixins: [InfinityScroll, User],
  components: {
    Loader,
    GayLogo,
    Banner,
    Nominee
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
      twitterScriptLoading: true
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
        return null;
      }
      return this.$store.state.awards.categories.data || [];
    },
    nominees() {
      return this.$store.state.awards.nominees;
    },
    modelsLoading() {
      if (this.$store.state.awards.fetchCategoriesLoading) {
        return true;
      } else if (this.$store.state.awards._fetchNomineesLoading) {
        return true;
      }
      return false;
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

      this.lastVoteId = id;
      const model = this.models.find(v => v.nomineeId === id);
      if (model.disabled) {
        return;
      }

      if (model.isVoted) {
        this.$store
          .dispatch("awards/unvote", {
            id,
            eventId: this.eventId,
            categoryId: this.categoryId
          })
          .then(() => {
            this.extendModels();
          });
      } else {
        this.$store
          .dispatch("awards/vote", {
            id,
            eventId: this.eventId,
            categoryId: this.categoryId
          })
          .then(() => {
            this.extendModels();
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
          this.extendModels();
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
    extendModels() {
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
    infinityScrollGetDataMethod() {
      this.fetchNominees();
    },
    addTwitterLib() {
      setTimeout(() => {
        let script = document.createElement("script");
        script.onload = () => {
          this.twitterScriptLoading = false;
        };
        script.async = true;
        script.src = "https://platform.twitter.com/widgets.js?" + Math.random();
        document.head.appendChild(script);
      }, 3000);
    }
  },
  watch: {
    categories(categories) {
      if (categories.length) {
        this.categoryId = categories[0].id;
      }
    },
    categoryId() {
      this.$store.commit("awards/resetNominees");
      this.fetchNominees();
      this.resetInfinityScroll();
    },
    nominees(nominees) {
      this.models = JSON.parse(JSON.stringify(nominees));
    }
  },
  created() {
    this.addTwitterLib();
  },
  mounted() {
    this.$store.dispatch("awards/fetchCategories", this.eventId);
  }
};
</script>
