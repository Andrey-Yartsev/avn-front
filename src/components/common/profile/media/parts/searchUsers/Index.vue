<template>
  <div class="b-search-form " v-click-outside="close">
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
        class="SearchResultsPopupCollectionView freeAccessMediaList"
        :class="{ hidden: !opened }"
      >
        <div class="users">
          <div class="SearchResultsPopupView">
            <div v-for="v in items" :key="v.id" class="user" @click="select(v)">
              <span class="avatar avatar_gap-r-sm avatar_sm">
                <span class="avatar__img">
                  <img :src="v.avatar" v-if="v.avatar" />
                </span>
              </span>
              <div class="username-group">
                <div class="user__name">
                  <div class="name">{{ v.name }}</div>
                  <span
                    class="verified-user icn-item"
                    :class="{
                      fullyMonetized: v.canEarn && v.canPayoutsRequest
                    }"
                    v-if="v.isVerified || (v.canEarn && v.canPayoutsRequest)"
                  ></span>
                </div>
                <span class="user-login reset-ml">{{ v.username }}</span>
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
      return "users";
    },
    getQueryString() {
      return `/search/users/${this.localQuery}`;
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
      this.$router.push("/search/users/" + this.localQuery, () => {});
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
    goTo(path) {
      this.$router.push(path);
      this.reset();
    },
    select(user) {
      this.close();
      const { id, name, username, avatar } = user;
      this.$emit("addUser", { id, name, username, avatar });
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
