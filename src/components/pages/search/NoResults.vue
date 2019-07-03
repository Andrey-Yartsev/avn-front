<template>
  <div
    v-if="loading"
    :class="{
      'loader-content': $mq === 'desktop',
      'loader-container': $mq === 'mobile'
    }"
  >
    <Loader
      :fullscreen="false"
      text="Loading"
      class="transparent"
      :class="{ small: $mq === 'desktop' }"
    />
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
