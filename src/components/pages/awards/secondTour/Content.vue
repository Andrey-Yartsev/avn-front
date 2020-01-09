<template>
  <div>
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
        Voting ends on {{ getEndVotingDate }} 2020 12:00PM. You can cast
        {{ maxVotes }} votes per day for this category. You have
        {{ remaining }} votes remaining
      </div>
      <div class="title-block">
        <h1>{{ currentCategory ? currentCategory.title : "..." }}</h1>
        <button
          @click="nextCategory"
          class="btn"
          v-if="!isLastCategory"
          :disabled="categoryChangeInProgress"
        >
          Next Category
        </button>
      </div>
    </template>
    <div class="models">
      <Loader v-if="categoryChangeInProgress" class="main-loader" />
      <figure
        v-for="nominee in models"
        :key="nominee.nomineeId"
        :class="{
          voted: nominee.isVoted,
          disabled: nominee.disabled || votingInProgress,
          selected: nominee.selected
        }"
        class="model-item"
      >
        <div :ref="'nom' + nominee.nomineeId" class="scroll-offset"></div>

        <div v-if="nominee.dummy" class="dummy"></div>
        <template v-else>
          <Loader
            v-if="voting(nominee.nomineeId)"
            :fullscreen="false"
            :inline="true"
            :small="true"
          />
          <div class="inner">
            <span class="btn-vote" @click="vote(nominee.nomineeId)" />
            <span
              class="btn"
              v-if="showFinishBtn(nominee.nomineeId)"
              @click="finishVote(nominee.nomineeId)"
              >Finish the vote!</span
            >
            <img
              :src="nominee.nominationAvatar"
              class="model-item__image"
              @click="vote(nominee.nomineeId)"
            />
            <div class="model-item__name">
              <div class="name">{{ nominee.nominationName }}</div>
              <!-- <TwitterShare
                v-if="!twitterScriptLoading"
                :nominee="nominee"
                :textString="twitterText"
              /> -->
              <a
                v-if="nominee.twitter && !twitterScriptLoading"
                :id="'nominee' + nominee.nomineeId"
                ref="tweetLink"
                target="_blank"
                :href="getHrefString(nominee.twitter)"
                class="btn-block btn-twitter"
                data-show-count="false"
              >
                <span class="icn-item icn-twitter icn-size_sm"></span>
                <span class="btn-twitter__label">Tweet</span>
              </a>
            </div>
          </div>
        </template>
      </figure>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import GayLogo from "../GayLogo";
import User from "@/mixins/user";
// import TwitterShare from "./TwitterShare";
import VueSelect from "vue-select";
import SmoothScroll from "smooth-scroll";
import "vue-select/dist/vue-select.css";

export default {
  mixins: [User],
  components: {
    Loader,
    GayLogo,
    // TwitterShare,
    VueSelect
  },
  props: {
    type: {
      type: String,
      default: "straight"
    }
  },
  data() {
    return {
      categoryId: 0,
      votes: [],
      maxVotes: 5,
      lastVoteId: 0,
      models: [],
      twitterScriptLoading: true,
      votingClickInProgress: false,
      selectedNomineeId: 0,
      initCategoriesFetch: false,
      fetchId: 0,
      votingClicking: false,
      categoryChangeInProgress: true,
      justVotedIds: []
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
      const n = this.maxVotes - this.votesCount;
      return n === 0 ? "no" : n;
    },
    votesCount() {
      return this.$store.state.awards.votesCount;
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
    },
    getEndVotingDate() {
      return this.$props.type === "straight" ? "Jan 25th" : "Jan 20th";
    },
    twitterText() {
      return this.$props.type === "straight"
        ? "#AVN @AVNAwards https://avn.to/vote on #AVNStars"
        : "#GayVNAwards https://stars.gayvn.com/gayvn_awards/voting on #GayVNStars";
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
                this.justVotedIds = this.justVotedIds.filter(
                  id => id !== nominee.nomineeId
                );
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
              this.justVotedIds.push(nominee.nomineeId);
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
          this.categoryChangeInProgress = false;
        });
    },
    voting(id) {
      if (id !== this.lastVoteId) {
        return false;
      }
      return this.votingInProgress;
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

      const scroll = new SmoothScroll();
      scroll.animateScroll(this.$refs["nom" + this.selectedNomineeId][0]);
    },
    initRequest() {
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

      if (this.categoryChangeInProgress) {
        this.categoryChangeInProgress = false;
      }
    },
    getHrefString(tweetname) {
      const fullText = `I watched, I came, I voted for ${tweetname} for the ${
        this.twitterText
      }`;
      let text = encodeURI(fullText) || "";
      text = text.replace(/#/g, "%23");
      return `https://twitter.com/intent/tweet?text=${text}`;
    },
    showFinishBtn(nomineeId) {
      return this.justVotedIds.indexOf(nomineeId) !== -1;
    },
    finishVote(nomineeId) {
      this.justVotedIds = this.justVotedIds.filter(id => id !== nomineeId);
      const link = document.getElementById(`nominee${nomineeId}`);
      if (link) {
        link.click();
      }
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
      this.models = [];
      if (!id) {
        if (this.selectedNomineeId) {
          this.selectedNomineeId = 0;
        }
        this.initRequest();
      } else {
        this.categoryChangeInProgress = true;
        if (!this.initCategoriesFetch) {
          if (this.$route.path !== this.basePath + "/" + id) {
            this.$router.push(this.basePath + "/" + id);
            this.selectedNomineeId = 0;
          }
        }
        this.fetchNominees();
      }
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
    this.initRequest();
  }
};
</script>
