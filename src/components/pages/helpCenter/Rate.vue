<template>
  <div class="support-article-vote">
    <div v-if="!rated">
      <div class="support-article-vote-header">Was this article helpful?</div>
      <div class="support-article-vote-btns">
        <span role="button" class="support-article-vote-btn" @click="like"
          >L</span
        >
        <span role="button" class="support-article-vote-btn" @click="dislike"
          >D</span
        >
      </div>
    </div>
    <div class="success" v-else>
      Thank you for voting
    </div>
  </div>
</template>

<script>
export default {
  name: "support-article-rate",
  props: {
    articleId: {
      type: Number,
      required: true
    }
  },
  methods: {
    like() {
      this.$store.dispatch("support/rate", {
        articleId: this.articleId,
        like: true
      });
    },
    dislike() {
      this.$store.dispatch("support/rate", {
        articleId: this.articleId,
        like: false
      });
    }
  },
  computed: {
    rated() {
      return !!this.$store.state.support.rateSuccess;
    }
  },
  watch: {
    articleId() {
      this.$store.commit("support/rateReset");
    }
  }
};
</script>
