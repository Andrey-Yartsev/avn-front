<template>
  <div class="form-group form-group_with-label">
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
        placeholder="Search"
        type="text"
        @focus="open"
        tabindex="1"
      />
      <span
        role="button"
        tabindex="-1"
        id="header-search-clear"
        class="btn-clear-search"
        :class="{ hidden: !canSearch }"
        @click="reset"
      />
      <button
        type="button"
        class="b-search-form__btn b-search-form__btn_mob header-search-submit"
        @click="() => {}"
        :disabled="!canSearch"
      ></button>

      <div class="header-search-results">
        <div
          class="SearchResultsPopupCollectionView"
          :class="{ hidden: !opened }"
        >
          <div class="users">
            <SearchUsers :items="items" @select="add" />
          </div>
          <button type="button" class="close" @click="reset"></button>
        </div>
      </div>

      <div v-if="usersForAdding && usersForAdding.length">
        <h2>Users to add</h2>
        <UsersTable :items="usersForAdding" @remove="removeAdding" />
        <button>Add</button>
      </div>

      <div v-if="addedUsers && addedUsers.length">
        <h2>Added users</h2>
        <UsersTable :items="usersForAdding" @remove="removeAdding" />
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import SearchUsers from "./SearchUsers";
import UsersTable from "./UsersTable";

export default {
  name: "UserSearchField",
  directives: {
    ClickOutside
  },
  components: {
    SearchUsers,
    UsersTable
  },
  data() {
    return {
      localQuery: "",
      opened: false,
      usersForAdding: []
    };
  },
  computed: {
    canSearch() {
      return false;
    },
    items() {
      return this.$store.state.trial.results.list;
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
    add(user) {
      this.usersForAdding.push(user);
      this.close();
    },
    removeAdding(user) {
      this.usersForAdding = this.usersForAdding.filter(v => v.id !== user.id);
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
