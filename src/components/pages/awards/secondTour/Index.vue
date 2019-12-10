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
          Voting ends on Jan 25th 2020 12:00PM. You can cast
          {{ maxVotes }} votes per day for this category. You have
          {{ remaining }} votes remaining
        </div>
        <div class="title-block">
          <h1>{{ currentCategory ? currentCategory.title : "..." }}</h1>
          <button @click="nextCategory" class="btn" v-if="!isLastCategory">
            Next Category
          </button>
        </div>
      </template>
      <div class="models">
        <figure
          v-for="nominee in models"
          :key="nominee.id"
          :class="{
            voted: nominee.isVoted,
            disabled: nominee.disabled || votingInProgress,
            selected: nominee.selected
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
      <Loader v-if="modelsLoading" />
    </template>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import GayLogo from "../GayLogo";
import User from "@/mixins/user";
import Banner from "./Banner";
import TwitterShare from "./TwitterShare";
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  mixins: [User],
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
      votingClickInProgress: false,
      selectedNomineeId: 0,
      initCategoriesFetch: false,
      fetchId: 0,
      votingClicking: false
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
    isLastCategory() {
      const index = this.categories.findIndex(v => v.id === this.categoryId);
      return index && index === this.categories.length - 1;
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
      if (this.votingClicking) {
        return true;
      }
      return (
        this.$store.state.awards._voteLoading ||
        this.$store.state.awards._unvoteLoading
      );
    },
    basePath() {
      if (this.isGay) {
        return "/gayvn_awards/voting";
      } else {
        return "/avn_awards/voting";
      }
    },
    _selectedNomineeId() {
      return parseInt(this.$route.params.nomineeId);
    },
    _categoryId() {
      return parseInt(this.$route.params.category);
    }
  },
  methods: {
    vote(id, initVote) {
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
      const nominee = this.models.find(v => {
        return v.nomineeId === id;
      });
      if (!nominee) {
        return;
      }
      if (nominee.disabled) {
        return;
      }

      this.votingClicking = true;

      setTimeout(() => {
        if (nominee.isVoted) {
          if (!initVote) {
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
                this.votingClicking = false;
              });
          } else {
            this.votingClicking = false;
          }
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
              if (initVote) {
                this.$store.dispatch("global/flashToast", {
                  text: "You have voted for " + nominee.nominationName
                });
              }
              this.votingClicking = false;
            });
        }
      }, 100);
    },
    nextCategory() {
      const i = this.categories.findIndex(v => v.id === this.categoryId);
      if (this.categories[i + 1]) {
        this.categoryId = this.categories[i + 1].id;
      }
    },
    fetchNominees() {
      clearTimeout(this.fetchId);
      this.fetchId = setTimeout(this._fetchNominees, 500);
    },
    _fetchNominees() {
      this.$store.commit("awards/resetNominees");
      this.$store
        .dispatch("awards/fetchNominees", {
          eventId: this.eventId,
          categoryId: this.categoryId
        })
        .then(() => {
          this.tryVoteSelectedNominee();
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
      this.setSelected();
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
    setSelected() {
      if (!this.selectedNomineeId) {
        return;
      }
      this.models = this.models.map(model => {
        if (model.nomineeId === this.selectedNomineeId) {
          model.selected = true;
        }
        return model;
      });
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
    addTwitterLib() {
      let script = document.createElement("script");
      script.onload = () => {
        this.twitterScriptLoading = false;
      };
      script.async = true;
      script.src = "https://platform.twitter.com/widgets.js?" + Math.random();
      document.head.appendChild(script);
    },
    tryVoteSelectedNominee() {
      if (!this.selectedNomineeId) {
        return;
      }
      this.vote(this.selectedNomineeId, true);
    }
  },
  watch: {
    categories(categories) {
      if (categories.length && !this.categoryId) {
        this.categoryId = categories[0].id;
      }
      this.fetchNominees();
    },
    categoryId(id) {
      if (!this.initCategoriesFetch) {
        if (this.$route.path !== this.basePath + "/" + id) {
          this.$router.push(this.basePath + "/" + id);
          this.selectedNomineeId = 0;
        }
      }
      this.fetchNominees();
    },
    nominees(nominees) {
      this.models = JSON.parse(JSON.stringify(nominees));
      this.extendNominees();
    },
    _categoryId(categoryId) {
      this.categoryId = categoryId;
    }
  },
  created() {
    this.addTwitterLib();
  },
  mounted() {
    this.initCategoriesFetch = true;
    this.$store.dispatch("awards/fetchCategories", this.eventId).then(() => {
      this.initCategoriesFetch = false;
    });

    if (this.$route.params.category) {
      this.categoryId = parseInt(this.$route.params.category);
    }

    if (this._selectedNomineeId) {
      this.selectedNomineeId = this._selectedNomineeId;
    }
  }
};
</script>
