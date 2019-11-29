<template>
  <div class="container awards">
    <div class="awards-header">
      <img :src="'/static/img/avnawards.png'" alt="" class="logo-awards" />
    </div>

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

    <Loader v-if="modelsLoading" />
    <template v-else>
      <h2>Please choose your top 5</h2>
      <div>
        Voting end on Dec 1st 2019 12:00PM. You can cast 5 votes per day for
        this category. You have 2 votes remaining
      </div>
      <div class="title-block">
        <h1>Privacy Policy</h1>
        <button @click="nextCategory" class="btn">Next Category</button>
      </div>
      <div class="models">
        <figure
          v-for="v in models"
          :key="v.nomineeId"
          :class="{ voted: v.isVoted, disabled: v.disabled }"
          @click="vote(v.nomineeId)"
        >
          <div v-if="v.dummy" class="dummy"></div>
          <template v-else>
            <Loader
              v-if="voting(v.nomineeId)"
              :fullscreen="false"
              :inline="true"
              :small="true"
            />
            <a class="button" />
            <img :src="v.nominationAvatar" class="image" />
            <div>{{ v.nominationName }}</div>
          </template>
        </figure>
      </div>
    </template>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";

export default {
  components: {
    Loader
  },
  data() {
    return {
      categoryId: 0,
      votes: [],
      maxVotes: 2,
      lastVoteId: 0,
      models: []
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
      return this.$store.state.awards.fetchNomineesResult;
    },
    modelsLoading() {
      if (this.$store.state.awards.fetchCategoriesLoading) {
        return true;
      } else if (this.$store.state.awards.fetchNomineesLoading) {
        return true;
      }
      return false;
    }
  },
  methods: {
    vote(id) {
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
            this.models = this.models.map(model => {
              if (model.nomineeId === id) {
                model.isVoted = false;
              }
              return model;
            });
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
            this.models = this.models.map(model => {
              if (model.nomineeId === id) {
                model.isVoted = true;
              }
              return model;
            });
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
      if (this.$store.state.awards.voteLoading) {
        return true;
      } else if (this.$store.state.awards.unvoteLoading) {
        return true;
      }
      return false;
    },
    extendModels() {
      this.setDisabled();
      this.addDummies();
    },
    setDisabled() {
      let votedCount = 0;
      this.models.map(model => {
        if (model.isVoted) {
          votedCount++;
        }
      });
      if (votedCount >= this.maxVotes) {
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
    }
  },
  watch: {
    categories(categories) {
      this.categoryId = categories[0].id;
    },
    categoryId() {
      this.fetchNominees();
    },
    nominees(nominees) {
      this.models = JSON.parse(JSON.stringify(nominees));
    }
  },
  mounted() {
    this.$store.dispatch("awards/fetchCategories", this.eventId);
  }
};
</script>
