<template>
    <div class="exploreView">
        <MobileHeader></MobileHeader>
        <a class="addPost-btn-float hidden-desktop" href="/addPost"></a>
        <div class="container">
            <div class="over-container">
                <Navigate></Navigate>
                <div class="explore">
                    <div :class="{
                      exploreAllCollectionView: page === 'all',
                      photoCollectionView: page === 'photos',
                      videoCollectionView: page === 'videos',
                      storyCollectionView: page === 'stories',
                      liveCollectionView: page === 'lives',
                    }">  
                        <div class="stories-all" v-if="page === 'all'">
                            <div class="exploreAllStoriesCollectionView">
                                <div class="explore-stories">
                                    <div class="exploreAllStoriesView">
                                        <StorySmall v-for="post in stories" :post="post" :key="post.id" from="explore" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div :class="['explore-wrapper', page]">
                            <Post v-for="post in posts" :post="post" :key="post.id" from="explore" />
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
import Post from "@/components/post/SmallView";
import StoryMedium from "@/components/story/MediumView";
import StorySmall from "@/components/story/SmallView";
import Navigate from "./navigate/Index";
import InfinityScrollMixin from "@/mixins/infinityScroll";

export default {
  name: "Explore",
  components: {
    MobileHeader,
    Navigate,
    Post,
    StoryMedium,
    StorySmall
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
    store() {
      // uses into InfinityScrollMixin
      if (["all", "videos", "photos"].indexOf(this.page) !== -1) {
        return this.$store.state.explore;
      }

      if (["stories"].indexOf(this.page) !== -1) {
        return this.$store.state.stories;
      }

      if (["lives"].indexOf(this.page) !== -1) {
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
    source() {
      if (this.page === "all") {
        return "media";
      }

      return this.page;
    }
  },
  methods: {
    infinityScrollGetDataMethod() {
      // uses into InfinityScrollMixin
      if (["all", "videos", "photos"].indexOf(this.page) !== -1) {
        this.$store.dispatch("explore/getPosts");
      }

      if (["stories"].indexOf(this.page) !== -1) {
        this.$store.dispatch("stories/getPosts");
      }

      if (["lives"].indexOf(this.page) !== -1) {
        this.$store.dispatch("lives/getPosts");
      }
    },
    getPageData() {
      this.$store.dispatch("explore/resetPageState");
      this.$store.dispatch("stories/resetPageState");
      this.$store.dispatch("lives/resetPageState");

      if (["all", "videos", "photos"].indexOf(this.page) !== -1) {
        this.$store.dispatch("explore/setSource", { source: this.source });
        this.$store.dispatch("explore/getPosts");
      }

      if (["all", "stories"].indexOf(this.page) !== -1) {
        this.$store.dispatch("stories/getPosts");
      }

      if (["lives"].indexOf(this.page) !== -1) {
        this.$store.dispatch("lives/getPosts");
      }
    }
  },
  watch: {
    page() {
      this.getPageData();
    }
  }
};
</script>
