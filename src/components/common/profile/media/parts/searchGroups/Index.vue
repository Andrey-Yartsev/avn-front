<template>
  <div class="b-search-form " v-click-outside="close">
    <input
      @keyup="keyup"
      v-model="localQuery"
      class="header-search-input rounded sm"
      name="query"
      autocomplete="off"
      :placeholder="placeholder"
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
      :disabled="!canSearch"
    />

    <div class="header-search-results">
      <div
        class="SearchResultsPopupCollectionView freeAccessMediaList"
        :class="{ hidden: !opened }"
      >
        <div class="users">
          <div class="SearchResultsPopupView">
            <div v-for="v in items" :key="v.id" class="user" @click="select(v)">
              <span class="avatar avatar_gap-r-sm avatar_sm">
                <span class="avatar__img">
                  <img :src="v.image" v-if="v.image" />
                </span>
              </span>
              <div class="username-group">
                <div class="user__name">
                  <div class="name">{{ v.title }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import { throttle } from "throttle-debounce";

export default {
  name: "SearchBubble",

  directives: {
    ClickOutside
  },

  data() {
    return {
      opened2: false,
      localQuery: "",
      cursorInField: false
    };
  },

  props: {
    placeholder: {
      type: String,
      default: "Search"
    }
  },

  computed: {
    throttledSearch() {
      return throttle(300, false, this.search, false);
    },
    loading() {
      return this.$store.state.search.groups.searchLoading;
    },
    opened() {
      return this.opened2 && this.localQuery;
    },
    items() {
      return this.$store.state.search.groups.results.list;
    },
    suggestions() {
      return this.$store.state.search.groups.results.suggestions;
    },
    canSearch() {
      if (!this.localQuery) {
        return false;
      }
      return !!this.localQuery.trim();
    },
    query() {
      return this.$route.params.query;
    }
  },

  watch: {
    query(query) {
      this.localQuery = query;
    },
    $route() {
      this.opened2 = false;
    },
    opened2(value) {
      this.$emit("togleSearchResult", value);
    }
  },

  methods: {
    keyup(e) {
      if (e.key === "Enter") {
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
    searchSilent() {
      this._search();
    },
    search() {
      this._search();
      this.open();
    },
    _search() {
      if (!this.localQuery) {
        this.$store.commit("search/groups/reset");
        return;
      }
      if (!this.localQuery.trim()) {
        this.$store.commit("search/groups/reset");
        return;
      }
      if (this.searchId) {
        clearTimeout(this.searchId);
      }
      this.searchId = setTimeout(() => {
        this.$store.dispatch("search/groups/search", {
          userId: this.$store.state.auth.user.id,
          query: this.localQuery
        });
      }, 200);
    },
    reset() {
      this.localQuery = "";
      this.opened2 = false;
      document.body.classList.remove("open-search-popup");
      this.$store.commit("search/groups/reset");
    },
    goTo(path) {
      this.$router.push(path);
      this.reset();
    },
    select(groiup) {
      this.close();
      const { id, title, image } = groiup;
      this.$emit("addGroup", { id, title, image });
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

<style lang="scss" scoped>
.SearchResultsPopupCollectionView {
  &.freeAccessMediaList {
    left: -6px;
  }
}
.user {
  cursor: pointer;
}
.user-login {
  display: block;
  text-align: left;
}
.icn-pos_center {
  right: 40px;
}
</style>
