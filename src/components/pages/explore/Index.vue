<template>
  <div class="exploreView">
    <MobileHeader></MobileHeader>
    <router-link class="addPost-btn-float hidden-desktop" to="/addPost"></router-link>
    <div class="container">
      <div class="over-container">
        <Navigate />
        <div class="stories-all" v-if="page === 'all' && stories.length">
          <div class="exploreAllStoriesCollectionView">
            <VuePerfectScrollbar class="explore-stories" @ps-scroll-x="scrollFunction">
              <StorySmall v-for="post in stories" :post="post" :key="post.id" from="explore" />
            </VuePerfectScrollbar>
          </div>
        </div>
        <div class="explore">
          <div :class="{
            exploreAllCollectionView: page === 'all',
            photoCollectionView: page === 'photos',
            videoCollectionView: page === 'videos',
            storyCollectionView: page === 'stories',
            liveCollectionView: page === 'lives',
          }">
            <div :class="['explore-wrapper', page]">
              <component
                :is="postComponent"
                v-for="post in posts"
                :post="post"
                :key="post.id" 
                from="explore"
              />
              <template v-if="page === 'stories'">
                <StoryMedium v-for="post in stories" :post="post" :key="post.id" from="explore" />
              </template>
            </div>
            <div class="msg-no-content" v-if="shouldShowNoPosts">
              <div class="msg-no-content__text">No posts here yet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MobileHeader from "@/components/header/Mobile";
import PostSmall from "@/components/post/SmallView";
import PostMedium from "@/components/post/MediumView";
import StoryMedium from "@/components/story/MediumView";
import StorySmall from "@/components/story/SmallView";
import Navigate from "./navigate/Index";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  name: "Explore",
  components: {
    MobileHeader,
    Navigate,
    PostSmall,
    PostMedium,
    StoryMedium,
    StorySmall,
    VuePerfectScrollbar
  },
  mixins: [InfinityScrollMixin],
  created() {
    this.getPageData();
  },
  computed: {
    posts() {
      return this.$store.state.explore.posts;
    },
    stories() {
      return this.$store.state.stories.posts;
    },
    storiesLoading() {
      return this.$store.state.stories.loading;
    },
    storiesAllDataReceived() {
      return this.$store.state.stories.allDataReceived;
    },
    store() {
      // uses into InfinityScrollMixin
      if (this.type === "media") {
        return this.$store.state.explore;
      }

      if (this.type === "story") {
        return this.$store.state.stories;
      }

      if (this.type === "live") {
        return this.$store.state.lives;
      }
    },
    shouldShowNoPosts() {
      const { loading, posts } = this.$store.state.explore;
      return !loading && !posts.length;
    },
    page() {
      return this.$route.meta.page;
    },
    type() {
      return this.$route.meta.type;
    },
    source() {
      if (this.page === "all") {
        return "media";
      }

      return this.page;
    },
    postComponent() {
      if (this.$mq === "mobile" && this.page === "videos") {
        return PostMedium;
      }

      return PostSmall;
    }
  },
  methods: {
    scrollFunction(e) {
      const { scrollWidth, scrollLeft, offsetWidth } = e.srcElement;
      const scrolledEnought = scrollWidth - (offsetWidth + scrollLeft) < 600;
      if (
        scrolledEnought &&
        !this.storiesLoading &&
        !this.storiesAllDataReceived
      ) {
        this.$store.dispatch("stories/getPosts");
      }
    },
    infinityScrollGetDataMethod() {
      // uses into InfinityScrollMixin
      if (this.type === "media") {
        this.$store.dispatch("explore/getPosts");
      }

      if (this.type === "story") {
        this.$store.dispatch("stories/getPosts");
      }

      if (this.type === "live") {
        this.$store.dispatch("lives/getPosts");
      }
    },
    getPageData() {
      this.$store.dispatch("explore/resetPageState");
      this.$store.dispatch("stories/resetPageState");
      this.$store.dispatch("lives/resetPageState");

      if (this.type === "media") {
        this.$store.dispatch("explore/setSource", { source: this.source });
        this.$store.dispatch("explore/getPosts");
      }

      if (["all"].indexOf(this.page) !== -1) {
        this.$store.dispatch("stories/setLimit", { limit: 20 });
      }

      if (["all", "stories"].indexOf(this.page) !== -1) {
        this.$store.dispatch("stories/setSource", { source: "" });
        this.$store.dispatch("stories/getPosts");
      }

      if (this.type === "live") {
        this.$store.dispatch("lives/getPosts");
      }
    }
  },
  watch: {
    page() {
      this.getPageData();
      this.lastYOffset = 0;
    }
  }
};
</script>
