<template>
  <div
    class="b-search-form b-search-form_flex-align header-search"
    :class="{ 'non-login-view': !isLogedIn }"
    v-click-outside="close"
  >
    <input
      @keyup="keyup"
      v-model="localQuery"
      class="header-search-input rounded sm"
      name="query"
      autocomplete="off"
      placeholder="Search"
      type="text"
      @focus="open"
      tabindex="1"
      :class="{ shifted: canSearch }"
    />
    <span
      role="button"
      tabindex="-1"
      id="header-search-clear"
      class="btn-clear-search icn-item btn-reset btn-reset_prim-color icn-pos_center"
      v-if="canSearch"
      @click="reset"
    />

    <button
      type="button"
      class="b-search-form__btn b-search-form__btn_mob header-search-submit icn-item"
      :class="{ 'icn-size_md': $mq === 'mobile' }"
      @click="toToSearchPage"
      :disabled="!canSearch"
    />

    <div class="header-search-results">
      <div
        class="SearchResultsPopupCollectionView"
        :class="{ hidden: !opened }"
      >
        <div class="search-query" v-if="suggestions && suggestions.length">
          <Suggestions :items="suggestions" :onSelect="selectSuggest" />
        </div>
        <div class="users">
          <component :is="resultsComponent" :items="items" @away="reset" />
        </div>
        <div class="search-all-link">
          <router-link :to="getQueryString" class="searchAllLink">
            <!-- <router-link
            :to="`/search/${type}/${localQuery}`"
            class="searchAllLink"
          > -->
            Search all for&nbsp;
            <span class="searchAllTag">{{ localQuery }}</span>
          </router-link>
        </div>
        <button
          type="button"
          class="close icn-item icn-size_lg"
          @click="reset"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import Users from "./types/Users";
import Posts from "./types/Posts";
import Suggestions from "./types/Suggestions";
import { throttle } from "throttle-debounce";
import GenderFilter from "@/components/common/GenderFilter";

export default {
  name: "SearchBubble",

  directives: {
    ClickOutside
  },

  components: {
    Users,
    Posts,
    Suggestions,
    GenderFilter
  },

  data() {
    return {
      opened2: false,
      localQuery: "",
      cursorInField: false
    };
  },

  computed: {
    throttledSearch() {
      return throttle(300, false, this.search, false);
    },
    loading() {
      return this.$store.state.search.bubble.searchLoading;
    },
    opened() {
      return this.opened2 && this.localQuery;
    },
    items() {
      return this.$store.state.search.bubble.results.list;
    },
    suggestions() {
      return this.$store.state.search.bubble.results.suggestions;
    },
    canSearch() {
      if (!this.localQuery) {
        return false;
      }
      return !!this.localQuery.trim();
    },
    query() {
      return this.$route.params.query;
    },
    type() {
      if (this.isQueryTag()) {
        return "posts";
      }
      return this.$route.params.type || "users";
    },
    resultsComponent() {
      if (this.type === "users") {
        return "Users";
      } else {
        return "Posts";
      }
    },
    getQueryString() {
      if (this.isQueryTag()) {
        return `/hashtag/${this.localQuery.slice(1)}`;
      } else {
        return `/search/${this.type}/${this.localQuery}`;
      }
    },
    isLogedIn() {
      return this.$store.state.auth.user;
    }
  },

  watch: {
    query(query) {
      this.localQuery = query;
    },
    $route() {
      this.opened2 = false;
    }
  },

  methods: {
    keyup(e) {
      if (e.key === "Enter") {
        this.toToSearchPage();
        this.close();
      } else {
        this.throttledSearch();
      }
    },
    open() {
      if (this.localQuery) {
        document.body.classList.add("open-search-popup");
        this.opened2 = true;
      }
    },
    close() {
      document.body.classList.remove("open-search-popup");
      this.opened2 = false;
    },
    toToSearchPage() {
      if (!this.canSearch) {
        return;
      }
      if (this.isQueryTag()) {
        this.$router
          .push(`/hashtag/${this.localQuery.slice(1)}`)
          .catch(() => {});
        this.close();
        return;
      } else {
        this.$router.push(
          "/search/" + this.type + "/" + this.localQuery,
          () => {}
        );
        this.close();
      }
    },
    searchSilent() {
      this._search();
    },
    search() {
      this._search();
      this.open();
    },
    _search() {
      if (!this.localQuery) {
        this.$store.commit("search/bubble/reset");
        return;
      }
      if (!this.localQuery.trim()) {
        this.$store.commit("search/bubble/reset");
        return;
      }
      if (this.searchId) {
        clearTimeout(this.searchId);
      }
      this.searchId = setTimeout(() => {
        this.$store.dispatch("search/bubble/search", {
          type: this.type,
          query: this.localQuery,
          strip_tags: 1
        });
      }, 200);
    },
    reset() {
      this.localQuery = "";
      this.opened2 = false;
      document.body.classList.remove("open-search-popup");
      this.$store.commit("search/bubble/reset");
    },
    selectSuggest(value) {
      this.localQuery = value;
      this._search();
    },
    isQueryTag() {
      return this.localQuery && this.localQuery.indexOf("#") === 0
        ? true
        : false;
    }
  },

  mounted() {
    setTimeout(() => {
      if (this.query) {
        this.localQuery = this.query;
      }
    }, 1);
  }
};
</script>
