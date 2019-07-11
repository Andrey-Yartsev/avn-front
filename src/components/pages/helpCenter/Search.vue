<template>
  <ContentWrapper>
    <template slot="content">
      <div class="s-breadcrumbs">
        <div class="container">
          <div class="breadcrumbs">
            <router-link to="/help" class="breadcrumbs__item"
              >Help Center
            </router-link>
            <span class="breadcrumbs__item current">Search</span>
          </div>
        </div>
      </div>
      <div class="s-container support-content shadow-block">
        <div class="container">
          <div class="error" v-if="error">
            {{ error }}
          </div>
          <template v-else>
            <div
              class="loader-container loader-container_center"
              v-if="loading"
            >
              <Loader :fullscreen="false" text="" class="small" />
            </div>
            <template v-else>
              <template v-if="visibleResults.length">
                <h3>Search results:</h3>
                <div class="search-results-support">
                  <ol>
                    <li v-for="v in visibleResults" :key="v.id">
                      <router-link :to="'/help/article/' + v.id">
                        <span>{{ v.title }}</span>
                      </router-link>
                      <span v-html="cutLength(v.description)"></span>
                    </li>
                  </ol>
                </div>
              </template>
              <template v-else>
                Nothing found
              </template>
            </template>
          </template>
        </div>
      </div>
    </template>
  </ContentWrapper>
</template>

<script>
import ContentWrapper from "./ContentWrapper";
import Loader from "@/components/common/Loader";
import InfinityScroll from "@/mixins/infinityScroll";

export default {
  name: "HelpCenterArticle",
  mixins: [InfinityScroll],
  components: {
    ContentWrapper,
    Loader
  },
  data() {
    return {
      loading: true,
      error: null,
      results: [],
      visibleResults: [],
      localSearchText: null,
      infinityScrollIndex: 0,
      infinityScrollStep: 10
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
    },
    store() {
      return {
        loading: this.loading,
        allDataReceived: false
      };
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
      this.error = null;
      text = text.trim();
      this.localSearchText = this.escapeRegExp(text);
      this.$store.commit("support/setSearchText", text);
      this.searchR(this.items);
      this.visibleResults = this.results.slice(0, this.infinityScrollStep);
    },
    matchSearch(item) {
      const re = new RegExp(this.localSearchText, "i");
      if (item.description.match(re)) {
        return true;
      } else if (item.title.match(re)) {
        return true;
      }
      return false;
    },
    stripHtml(html) {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    },
    cut(v) {
      if (!v) {
        return "…";
      }
      if (v.length <= 100) {
        return v;
      }
      return v.substring(0, 100) + "…";
    },
    cutLength(html) {
      return this.cut(this.stripHtml(html));
    },
    infinityScrollGetDataMethod() {
      this.infinityScrollIndex++;
      const lastIndex =
        (this.infinityScrollIndex + 1) * this.infinityScrollStep;
      this.visibleResults = this.visibleResults.concat(
        this.results.slice(
          this.infinityScrollIndex * this.infinityScrollStep,
          lastIndex
        )
      );
      if (lastIndex >= this.results.length) {
        this.store.allDataReceived = true;
      }
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
