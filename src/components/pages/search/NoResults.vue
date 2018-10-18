<template>
  <div class="no-results-search" v-if="loading">
    <div class="no-results-search__message">
      <span class="no-results-search__text">Loading</span>
    </div>
  </div>
  <div class="no-results-search" v-else>
    <div class="no-results-search__message">
      <span class="no-results-search__text">Nothing found for&nbsp;</span>
      <span class="searchAllTag">"{{ query }}"</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchNoResults",
  props: ["query", "loading"]
};
</script>

<style scoped>
.no-results-search {
  display: block;
}
</style>
