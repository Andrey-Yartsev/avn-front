<template>
  <div>
    <div
      class="b-search-form b-search-form_flex-align header-search"
      v-click-outside="close"
    >
      <input
        @keyup="keyup"
        v-model="localQuery"
        class="header-search-input rounded sm"
        name="query"
        maxlength="13"
        autocomplete="off"
        :placeholder="placeholder"
        type="text"
        @focus="open"
        tabindex="1"
      />
      {{ selected.name }}

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

      <div class="header-search-results">
        <div
          class="SearchResultsPopupCollectionView"
          :class="{ hidden: !opened }"
        >
          <div class="users">
            <SearchUsers :items="items" @select="setUser" />
          </div>
          <button type="button" class="close" @click="reset"></button>
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
      return this.$store.state.trial.results.list;
    },
    selected() {
      return this.user || "";
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
      if (!this.localQuery.trim()) {
        this.$store.commit("trial/reset");
        return;
      }
      if (this.searchId) {
        clearTimeout(this.searchId);
      }
      this.searchId = setTimeout(() => {
        this.$store.dispatch("trial/search", {
          type: this.type,
          query: this.localQuery
        });
      }, 200);
    },
    setUser(user) {
      this.user = user;
      this.close();
    },
    open() {
      this.opened = true;
    },
    reset() {
      this.localQuery = "";
      this.opened = false;
      this.$store.commit("search/bubble/reset");
    },
    close() {
      this.opened = false;
    }
  }
};
</script>
