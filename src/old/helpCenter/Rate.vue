<template>
  <div class="article-vote">
    <div v-if="!rated">
      <div class="article-vote__header">Was this article helpful?</div>
      <div class="article-vote__btns">
        <span
          role="button"
          class="article-vote__btn vote-like"
          @click="like"
        ></span>
        <span
          role="button"
          class="article-vote__btn vote-dislike"
          @click="dislike"
        ></span>
      </div>
    </div>
    <div class="success-vote" v-else>
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
