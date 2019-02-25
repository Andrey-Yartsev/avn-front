<template>
  <ContentWrapper>
    <template slot="content">
      <div class="breadcrumbs">
        <router-link to="/support">Help Center</router-link> >
        <span>Article</span>
      </div>
      <div class="loader-container" v-if="loading">
        <Loader :fullscreen="false" text="" class="transparent small" />
      </div>
      <div v-else class="row">
        <div class="col col-1-4">
          <div class="questions-list">
            <ul v-if="items && items.length">
              <NodeTree v-for="node in items" :node="node" :key="node.id" />
            </ul>
          </div>
        </div>
        <div class="col col-3-4">
          <h3>{{ item.title }}</h3>
          <span v-html="item.description"></span>
        </div>
      </div>
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
      item: null,
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
      return this.$store.state.support.searchText;
    }
  },
  watch: {
    searchText(searchText) {
      this.search(searchText);
    }
  },
  methods: {
    findR(items, id) {
      for (let item of items) {
        if (item.id === id) {
          return item;
        }
        if (item.items && item.items.length) {
          let r = this.findR(item.items, id);
          if (r) {
            return r;
          }
        }
      }
      return null;
    },
    searchR(items) {
      for (let item of items) {
        if (this.matchSearch(item)) {
          return item;
        }
        if (item.items && item.items.length) {
          let r = this.searchR(item.items);
          if (r) {
            return r;
          }
        }
      }
      return null;
    },
    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    },
    search(text) {
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
    this.$store.dispatch("support/fetch").then(() => {
      this.loading = false;
      this.item = this.findR(this.items, this.id);
    });
  }
};
</script>
