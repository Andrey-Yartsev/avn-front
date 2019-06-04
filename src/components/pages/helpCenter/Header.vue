<template>
  <div class="support-header">
    <h1>Help Center</h1>
    <form action="#" class="support-search-form" @submit.stop.prevent="search">
      <input
        type="text"
        class="lg rounded"
        v-model="searchText"
        placeholder="Search"
      />
      <button
        type="button"
        class="b-search-form__btn b-search-form__btn_mob header-search-submit icn-item lg"
        :disabled="!canSearch"
        @click="search"
      ></button>
    </form>
    <div class="popular-questions suggestions">
      <router-link
        :to="'/help/' + v.id"
        v-for="v in suggestions"
        :key="v.id"
        class="question-item"
        >{{ v.title }}</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchCenterHeader",
  data() {
    return {
      searchText: ""
    };
  },
  computed: {
    canSearch() {
      return this.searchText.length >= 3;
    },
    suggestions() {
      if (!this.$store.state.support.common) {
        return [];
      }
      return this.$store.state.support.common.suggestions;
    }
  },
  methods: {
    search() {
      this.$router.push(`/help/search/${this.searchText}`);
    }
  }
};
</script>
