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
        placeholder="Search"
        type="text"
        @focus="open"
        tabindex="1"
      />
      <span
        role="button"
        tabindex="-1"
        id="header-search-clear"
        class="btn-clear-search icn-item btn-reset btn-reset_prim-color icn-pos_center"
        :class="{ hidden: !canSearch }"
        @click="reset"
      />
      <button
        type="button"
        class="b-search-form__btn b-search-form__btn_mob header-search-submit icn-item"
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
    </div>

    <div v-if="usersForAdding && usersForAdding.length">
      <div
        class="form-title border-top table-header-title table-header-title_sticky bg-gradient bg-gradient_pseudo"
      >
        <div class="bg-gradient__shadow bg-gradient__shadow_mob">
          <div class="inner">
            <span class="semi-transparent">
              Users to add
            </span>
          </div>
          <div class="table-header blocked-table-header ">
            <div class="user table__cell">
              User
            </div>
            <div
              class="date table__cell table__cell_align-hor-c table__cell_selected"
            >
              Date
            </div>
            <div
              class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_status"
            >
              Status
            </div>
            <div class="table__cell table__cell_remove">
              &nbsp;
            </div>
          </div>
        </div>
      </div>
      <div class="shadow-block no-padding">
        <UsersTable :items="usersForAdding" @remove="removeAdding" />
        <div class="buttons-row">
          <div class="container">
            <button class="btn lg">Add</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="addedUsers && addedUsers.length">
      <div
        class="form-title border-top table-header-title table-header-title_sticky bg-gradient bg-gradient_pseudo"
      >
        <div class="bg-gradient__shadow bg-gradient__shadow_mob">
          <div class="inner">
            <span class="semi-transparent">
              Added users
            </span>
          </div>
          <div class="table-header blocked-table-header ">
            <div class="user table__cell">
              User
            </div>
            <div
              class="date table__cell table__cell_align-hor-c table__cell_selected"
            >
              Date
            </div>
            <div
              class="table__cell table__cell_align table__cell_align-vert-c table__cell_align-hor-c table__cell_status"
            >
              Status
            </div>
            <div class="table__cell table__cell_remove">
              &nbsp;
            </div>
          </div>
        </div>
      </div>
      <div class="shadow-block no-padding">
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
