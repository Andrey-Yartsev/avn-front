<template>
  <div
    v-if="loading"
    class="loader-container"
    :class="{ 'loader-container_center': $mq === 'mobile' }"
  >
    <Loader :fullscreen="false" :inline="true" />
  </div>
  <div class="no-results-search" v-else-if="!items.length">
    <div class="no-results-search__message">
      <span class="no-results-search__text">Nothing found for&nbsp;</span>
      <span class="searchAllTag">"{{ query }}"</span>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";

export default {
  name: "SearchNoResults",
  components: {
    Loader
  },
  props: ["query", "loading"],
  computed: {
    items() {
      return this.$store.state.search.page.posts;
    }
  }
};
</script>
