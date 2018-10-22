<template>
  <div class="searchView">
    <div class="container">
      <div class="over-container">
        <nav class="explore-nav">
          <router-link
            v-for="v in types"
            v-bind:key="v.name"
            :to="'/search/' + v.name + '/' + query"
            :class="{active: v.active}"
          >{{ v.title }}</router-link>
        </nav>
        <div class="explore">
          <component
            :is="component"
            :items="items"
            :loading="loading"
            :query="query"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Users from "./Users";
import Posts from "./Posts";
import Videos from "./Videos";
import Photos from "./Photos";

const types = {
  users: "People",
  posts: "Posts",
  videos: "Videos",
  photos: "Photos"
};

export default {
  name: "Search",

  components: {
    Users,
    Posts,
    Videos,
    Photos
  },

  computed: {
    component() {
      return this.type.charAt(0).toUpperCase() + this.type.slice(1);
    },
    query() {
      return this.$route.params.query;
    },
    type() {
      return this.$route.params.type;
    },
    items() {
      return this.$store.state.search.page.items;
    },
    types() {
      return Object.entries(types).map(v => {
        return {
          name: v[0],
          title: v[1],
          active: v[0] === this.type
        };
      });
    },
    loading() {
      return this.$store.state.search.page.searchLoading;
    }
  },

  methods: {
    search() {
      this.$store.dispatch("search/page/search", {
        type: this.type,
        query: this.query,
        offset: 0,
        limit: 10
      });
    },
    changeType(type) {
      this.$router.push(`/search/${type}/${this.query}`);
    }
  },

  watch: {
    query() {
      this.search();
    },
    type() {
      this.$store.commit("search/page/reset");
      this.search();
    }
  },

  created() {
    this.search();
  }
};
</script>
