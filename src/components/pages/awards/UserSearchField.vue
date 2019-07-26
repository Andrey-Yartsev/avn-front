<template>
  <div>
    <div class="b-search-form b-search-form_flex-align" v-click-outside="close">
      <input
        @keyup="keyup"
        v-model="localQuery"
        class="header-search-input rounded md placeholder-dark"
        name="query"
        maxlength="13"
        autocomplete="off"
        :placeholder="_placeholder"
        type="text"
        @focus="open"
        tabindex="1"
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
        :class="{ 'icn-size_lg': $mq === 'mobile' }"
        @click="() => {}"
        :disabled="!canSearch"
      ></button>

      <span
        role="button"
        tabindex="-1"
        class="btn-clear-search icn-item btn-reset btn-reset_prim-color icn-pos_center"
        v-if="user"
        @click="resetValue"
      ></span>

      <div class="header-search-results">
        <div
          class="SearchResultsPopupCollectionView"
          :class="{ hidden: !opened }"
        >
          <div v-if="searchLoading">Loading</div>
          <div class="users" v-else>
            <SearchUsers :items="items" @select="setUser" />
          </div>
          <button
            type="button"
            class="close icn-item icn-size_lg"
            @click="reset"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import SearchUsers from "./SearchUsers";

export default {
  name: "UserSearchField",
  directives: {
    ClickOutside
  },
  components: {
    SearchUsers
  },
  props: {
    placeholder: String
  },
  data() {
    return {
      localQuery: "",
      opened: false,
      user: null
    };
  },
  computed: {
    canSearch() {
      return false;
    },
    items() {
      return this.$store.state.awards.searchResult;
    },
    selected() {
      return this.user || "";
    },
    _placeholder() {
      if (this.selected) {
        return this.selected.name;
      }
      return "";
    },
    searchLoading() {
      return this.$store.state.awards.searchLoading;
    }
  },
  methods: {
    keyup(e) {
      if (e.key === "Enter") {
        // add
        this.close();
      } else {
        this.search();
      }
    },
    search() {
      this._search();
      this.open();
    },
    _search() {
      this.$store.commit("awards/reset");
      if (!this.localQuery.trim()) {
        return;
      }
      if (this.searchId) {
        clearTimeout(this.searchId);
      }
      this.searchId = setTimeout(() => {
        this.$store.dispatch("awards/search", {
          type: this.type,
          query: this.localQuery
        });
      }, 200);
    },
    setUser(user) {
      this.user = user;
      this.$emit("input", user.name);
      this.localQuery = "";
      this.close();
    },
    open() {
      if (!this.localQuery) {
        return;
      }
      this.opened = true;
    },
    reset() {
      this.localQuery = "";
      this.opened = false;
    },
    close() {
      this.opened = false;
    },
    resetValue() {
      this.user = null;
    }
  }
};
</script>
