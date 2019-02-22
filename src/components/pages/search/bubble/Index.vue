<template>
  <div class="b-search-form b-search-form_flex-align header-search">
    <input
      @keyup="keyup"
      v-model="localQuery"
      class="header-search-input rounded sm"
      name="query"
      maxlength="13"
      autocomplete="off"
      placeholder="Search"
      type="text"
      @focus="open"
      v-click-outside="close"
      tabindex="1"
    />
    <span
      role="button"
      tabindex="-1"
      id="header-search-clear"
      class="btn-clear-search"
      :class="{ hidden: !canSearch }"
    ></span>

    <button
      type="button"
      class="b-search-form__btn b-search-form__btn_mob header-search-submit"
      @click="toToSearchPage"
      :disabled="!canSearch"
    ></button>

    <!--
    <button
      type="button"
      class="btn-clear-search"
      :class="{hidden: !opened}"
      @click="reset"
    ></button>
    -->

    <div class="header-search-results">
      <div
        class="SearchResultsPopupCollectionView"
        :class="{ hidden: !opened }"
      >
        <div class="search-query" style="display: none;">
          <ul class="search-query__list">
            <li class="search-query__item">
              <a href="#" class="search-query__link">Lorem ipsum</a>
            </li>
            <li class="search-query__item">
              <a href="#" class="search-query__link">Lorem ipsum</a>
            </li>
            <li class="search-query__item">
              <a href="#" class="search-query__link">Lorem ipsum</a>
            </li>
          </ul>
        </div>
        <div class="users">
          <component :is="resultsComponent" :items="items" @away="reset" />
        </div>
        <div class="search-all-link">
          <a
            :href="'/search/users/' + localQuery"
            @click.prevent="goTo('/search/users/' + localQuery)"
            class="searchAllLink"
          >
            Search all for&nbsp;
            <span class="searchAllTag">{{ localQuery }}</span>
          </a>
        </div>
        <button type="button" class="close" @click="reset"></button>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import Users from "./types/Users";
import Posts from "./types/Posts";

export default {
  name: "SearchBubble",

  directives: {
    ClickOutside
  },

  components: {
    Users,
    Posts
  },

  data() {
    return {
      opened2: false,
      localQuery: "",
      cursorInField: false
    };
  },

  computed: {
    loading() {
      return this.$store.state.search.bubble.searchLoading;
    },
    opened() {
      return this.opened2 && this.localQuery;
    },
    items() {
      return this.$store.state.search.bubble.items;
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
      return this.$route.params.type || "users";
    },
    resultsComponent() {
      if (this.type === "users") {
        return "Users";
      } else {
        return "Posts";
      }
    }
  },

  watch: {
    query(query) {
      this.localQuery = query;
    }
  },

  methods: {
    keyup(e) {
      if (e.key === "Enter") {
        this.toToSearchPage();
        this.close();
      } else {
        this.search();
      }
    },
    open() {
      if (this.localQuery) {
        this.opened2 = true;
      }
    },
    close() {
      this.opened2 = false;
    },
    goTo(path) {
      this.$router.push(path);
    },
    toToSearchPage() {
      if (!this.canSearch) {
        return;
      }
      this.$router.push("/search/" + this.type + "/" + this.localQuery);
      this.close();
    },
    searchSilent() {
      this._search();
    },
    search() {
      this._search();
      this.open();
    },
    _search() {
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
          query: this.localQuery
        });
      }, 200);
    },
    reset() {
      this.localQuery = "";
      this.opened2 = false;
      this.$store.commit("search/bubble/reset");
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
