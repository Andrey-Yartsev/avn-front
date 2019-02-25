<template>
  <ContentWrapper>
    <template slot="content">
      <div class="breadcrumbs">
        <router-link to="/support">Help Center</router-link> >
        <span>Search</span>
      </div>
      <div class="error" v-if="error">
        {{ error }}
      </div>
      <template v-else>
        <div class="loader-container" v-if="loading">
          <Loader :fullscreen="false" text="" class="transparent small" />
        </div>
        <template v-else>
          <template v-if="results.length">
            Search results:
            <ol v-if="results.length">
              <li v-for="v in results" :key="v.id">
                <router-link :to="'/support/article/' + v.id">{{
                  v.title
                }}</router-link>
              </li>
            </ol>
          </template>
          <template v-else>
            Nothing found
          </template>
        </template>
      </template>
    </template>
  </ContentWrapper>
</template>

<script>
import ContentWrapper from "./ContentWrapper";
import NodeTree from "./NodeTree";
import Loader from "@/components/common/Loader";

export default {
  name: "HelpCenterArticle",
  components: {
    ContentWrapper,
    NodeTree,
    Loader
  },
  data() {
    return {
      loading: true,
      error: null,
      results: [],
      localSearchText: null
    };
  },
  computed: {
    items() {
      return this.$store.state.support.items;
    },
    id() {
      return parseInt(this.$route.params.id);
    },
    searchText() {
      return this.$route.params.text;
    }
  },
  watch: {
    searchText(searchText) {
      this.search(searchText);
    }
  },
  methods: {
    searchR(items) {
      for (let item of items) {
        if (this.matchSearch(item)) {
          this.results.push(item);
        }
        if (item.items && item.items.length) {
          this.searchR(item.items);
        }
      }
      return null;
    },
    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    },
    search(text) {
      this.results = [];
      this.localSearchText = this.escapeRegExp(text);
      this.searchR(this.items);
    },
    matchSearch(item) {
      const re = new RegExp(this.localSearchText);
      if (item.description.match(re)) {
        return true;
      } else if (item.title.match(re)) {
        return true;
      }
      return false;
    }
  },
  mounted() {
    if (this.searchText.length < 3) {
      this.error = "Minimal length for search text is 3 characters";
      return;
    }
    this.$store.dispatch("support/fetch").then(() => {
      this.loading = false;
      this.search(this.searchText);
    });
  }
};
</script>
