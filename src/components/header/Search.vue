<template>
  <div
    class="header-search"
  >
    <input
      @keyup="keyup"
      v-model="query"
      class="header-search-input rounded sm"
      name="query" maxlength="13" autocomplete="off"
      placeholder="Search" type="text"/>
    <span role="button" tabindex="-1" id="header-search-clear"></span>

    <button
      type="button" class="header-search-submit"
      @click="toToSearchPage"
    ></button>

    <button
      type="button"
      class="btn-clear-search"
      :class="{hidden: !opened}"
      @click="reset"
    ></button>

    <div class="header-search-results">
      <div
        class="SearchResultsPopupCollectionView"
        :class="{hidden: !opened}"
        v-click-outside="reset"
      >
        <div class="users">
          <div class="SearchResultsPopupView">
            <a
              :href="'/' + v.username"
              @click.prevent="goTo('/' + v.username)"
              class="user"
              v-for="v in items"
              v-bind:key="v.id"
            >
              <span class="avatar"></span>
              <div class="user__name">
                <div class="name">{{ v.name }}</div>
              </div>
              <span class="user-login">{{ v.username }}</span>
              <span v-if="v.isVerified" class="verified-user"></span>
            </a>
          </div>
        </div>
        <div class="search-all-link">
          <a
            :href="'/search/users/' + query"
            @click.prevent="goTo('/search/users/' + query)"
            class="searchAllLink"
          >
            Search all for&nbsp;{{ query }}
            <span class="searchAllTag"></span>
          </a>
        </div>
        <button type="button" class="close" @click="reset"></button>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
  name: "SearchBubble",

  directives: {
    ClickOutside
  },

  data() {
    return {
      opened2: false,
      query: ""
    };
  },

  computed: {
    opened() {
      return this.opened2 && this.query;
    },
    items() {
      return this.$store.state.search.bubble.items;
    }
  },

  watch: {
    query() {
      this.search();
    }
  },

  methods: {
    keyup(e) {
      if (e.key === "Enter") {
        this.toToSearchPage();
      }
    },
    goTo(path) {
      this.$router.push(path);
      this.reset();
    },
    toToSearchPage() {
      this.$router.push("/search/users/" + this.query);
      this.reset();
    },
    search() {
      if (!this.query) {
        this.$store.commit("search/bubble/reset");
        return;
      }
      if (this.searchId) {
        clearTimeout(this.searchId);
      }
      this.searchId = setTimeout(() => {
        this.$store
          .dispatch("search/bubble/search", {
            query: this.query
          })
          .then(() => {
            this.opened2 = true;
          });
      }, 200);
    },
    reset() {
      this.query = "";
      this.opened2 = false;
      this.$store.commit("search/bubble/reset");
    }
  }
};
</script>
