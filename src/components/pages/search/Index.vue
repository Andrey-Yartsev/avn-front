<template>
  <div class="searchView">
    <div class="container">
      <div class="over-container">
        <nav class="content-nav">
          <template v-for="v in types">
            <router-link
              v-bind:key="v.name"
              v-if="summary[`${v.name}Count`]"
              :to="'/search/' + v.name + '/' + query"
              class="content-nav__item"
            >
              {{ v.title }}
              <span v-if="summary[`${v.name}Count`]" class="label-counter">
                {{ countHelper(+summary[`${v.name}Count`]) }}
              </span>
            </router-link>
            <span class="content-nav__item disabled" v-bind:key="v.name" v-else>
              {{ v.title }}
            </span>
          </template>
        </nav>
        <div class="explore">
          <div
            :class="{
              wrapperClass,
              'search-loading-content': loading && !items.length
            }"
          >
            <component
              v-if="component === 'Users'"
              :is="component"
              :items="items"
              :loading="loading"
              :query="query"
              actionPrefix="search/page"
            />
            <component
              v-else
              :is="component"
              :items="items"
              :loading="loading"
              :query="query"
            />
            <NoResults :query="query" :loading="loading && !items.length" />
          </div>
          <div class="loader-infinity" v-if="loading && items.length">
            <Loader :fullscreen="false" :inline="true" :small="true" />
          </div>
        </div>
      </div>
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Users from "@/components/users/Users";
import Posts from "./types/Posts";
import Videos from "./types/Videos";
import Photos from "./types/Photos";
import Clips from "./types/Clips";
import InfinityScroll from "@/mixins/infinityScroll";
import NoResults from "./NoResults";
import Footer from "@/components/footer/Index";
import Loader from "@/components/common/Loader";

const types = {
  users: "People",
  posts: "Posts",
  videos: "Videos",
  photos: "Photos",
  clips: "Clips"
};

const wrapperClasses = {
  posts: "postCollectionView",
  users: "userCollectionView",
  video: "videoCollectionView",
  photo: "photoCollectionView",
  clip: "clipCollectionView"
};

export default {
  name: "Search",

  mixins: [InfinityScroll],

  components: {
    Users,
    Posts,
    Videos,
    Photos,
    Clips,
    NoResults,
    Footer,
    Loader
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
    },
    summary() {
      return this.$store.state.search.summary.summary;
    }
  },

  methods: {
    getSummary() {
      this.$store.commit("search/summary/reset");
      this.$store.dispatch("search/summary/search", {
        query: this.query
      });
    },
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
      this.$router
        .push(`/search/${this.type}/${this.localQuery}`)
        .catch(() => {});
    },
    changeType(type) {
      this.$router.push(`/search/${type}/${this.query}`).catch(() => {});
    },
    infinityScrollGetDataMethod() {
      this.searchNext();
    },
    countHelper(count) {
      return count < 100 ? count : "99+";
    }
  },

  watch: {
    query() {
      this.$store.commit("search/summary/reset");
      this.getSummary();
      this.search();
      this.localQuery = this.query;
    },
    type() {
      this.lastYOffset = 0;
      this.$store.commit("search/page/reset");
      this.$store.commit("search/summary/reset");
      this.$router
        .push(`/search/${this.type}/${this.localQuery}`)
        .catch(() => {});
      this.getSummary();
      this.search();
    },
    summary() {
      let goTo;

      if (this.summary[`${this.type}Count`] === 0) {
        switch (true) {
          case this.summary.photosCount > 0:
            goTo = "photos";
            break;
          case this.summary.videosCount > 0:
            goTo = "videos";
            break;
          case this.summary.postsCount > 0:
            goTo = "posts";
            break;
          case this.summary.usersCount > 0:
            goTo = "users";
            break;
          case this.summary.clipsCount > 0:
            goTo = "clips";
            break;
          default:
            break;
        }
      }

      if (goTo) {
        this.$router.push(`/search/${goTo}/${this.localQuery}`).catch(() => {});
      }
    }
  },

  created() {
    if (this.query) {
      this.localQuery = this.query;
    }
    this.search();
    this.getSummary();
  },

  beforeDestroy() {
    this.$store.commit("search/bubble/reset");
    this.$store.commit("search/summary/reset");
  }
};
</script>
