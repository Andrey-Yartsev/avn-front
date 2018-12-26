<template>
  <div class="searchView">
    <div class="container">
      <div class="over-container">
        <nav class="content-nav">
          <router-link
            v-for="v in types"
            v-bind:key="v.name"
            :to="'/search/' + v.name + '/' + query"
            :class="{active: v.active}"
            class="content-nav__item"
          >{{ v.title }}</router-link>
        </nav>
        <div class="header-search-page">
          <div class="field">
            <form v-on:submit.stop.prevent="searchChange" class="b-search-form b-search-form_flex-align">
              <input
                type="text"
                placeholder="Search"
                v-model="localQuery"
                class="sm"
              >
              <span role="button" tabindex="-1" class="btn-clear-search hidden" id="header-search-clear"></span>
              <button
                type="submit"
                class="b-search-form__btn b-search-form__btn_mob"
                :disabled="!canSearch"
              ></button>
            </form>
          </div>
        </div>

        <div class="explore">
          <div :class="wrapperClass">
            <component
              :is="component"
              :items="items"
              :loading="loading"
              :query="query"
            />
            <NoResults :query="query" :loading="loading" />
          </div>
        </div>
      </div>
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Users from "./types/Users";
import Posts from "./types/Posts";
import Videos from "./types/Videos";
import Photos from "./types/Photos";
import InfinityScroll from "@/mixins/infinityScroll";
import NoResults from "./NoResults";
import Footer from "@/components/pages/static/Footer";

const types = {
  users: "People",
  posts: "Posts",
  videos: "Videos",
  photos: "Photos"
};

const wrapperClasses = {
  posts: "postCollectionView",
  users: "userCollectionView",
  video: "videoCollectionView",
  photo: "photoCollectionView"
};

export default {
  name: "Search",

  mixins: [InfinityScroll],

  components: {
    Users,
    Posts,
    Videos,
    Photos,
    NoResults,
    Footer
  },

  data: () => ({
    loadingName: "searchRequestLoading",
    localQuery: ""
  }),

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
    wrapperClass() {
      return wrapperClasses[this.type];
    },
    items() {
      return this.$store.state.search.page.posts;
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
      return this.$store.state.search.page.searchRequestLoading;
    },
    store() {
      return this.$store.state.search.page;
    },
    canSearch() {
      return !!this.localQuery.trim();
    }
  },

  methods: {
    search() {
      if (!this.canSearch) {
        return;
      }
      this.$store.commit("search/page/reset");
      this.$store.dispatch("search/page/search", {
        type: this.type,
        query: this.query
      });
    },
    searchNext() {
      this.$store.dispatch("search/page/searchNext", {
        type: this.type,
        query: this.query
      });
    },
    searchChange() {
      this.$router.push(`/search/${this.type}/${this.localQuery}`);
    },
    changeType(type) {
      this.$router.push(`/search/${type}/${this.query}`);
    },
    infinityScrollGetDataMethod() {
      this.searchNext();
    }
  },

  watch: {
    query() {
      this.search();
      this.localQuery = this.query;
    },
    type() {
      this.$store.commit("search/page/reset");
      this.$router.push(`/search/${this.type}/${this.localQuery}`);
      this.search();
    }
  },

  created() {
    if (this.query) {
      this.localQuery = this.query;
    }
    this.search();
  }
};
</script>
