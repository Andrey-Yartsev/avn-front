<template>
  <div class="support-header">
    <h1>Help Center</h1>
    <form action="#" class="support-search-form" @submit.stop.prevent="search">
      <input
        type="text"
        class="lg rounded"
        v-model="localSearchText"
        placeholder="Search"
      />
      <button
        type="button"
        class="b-search-form__btn b-search-form__btn_mob header-search-submit icn-item lg icn-size_lg"
        :disabled="!canSearch"
        @click="search"
      ></button>
    </form>
    <div class="popular-questions suggestions" v-if="$mq === 'desktop'">
      <router-link
        :to="'/help/article/' + v.id"
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
      localSearchText: ""
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
    },
    searchText() {
      return this.$store.state.support.searchText;
    }
  },
  methods: {
    search() {
      this.$router.push(`/help/search/${this.localSearchText}`);
    }
  },
  watch: {
    searchText(text) {
      this.localSearchText = text;
    }
  }
};
</script>
