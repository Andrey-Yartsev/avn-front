<template>
    <div class="exploreView">
        <MobileHeader></MobileHeader>
        <a class="addPost-btn-float hidden-desktop" href="/addPost"></a>
        <div class="container">
            <div class="over-container">
                <Navigate></Navigate>
                <div class="explore">
                    <div class="exploreAllCollectionView">
                        <div class="stories-all">
                            <div class="exploreAllStoriesCollectionView">
                                <div class="explore-stories">
                                    <div class="exploreAllStoriesView">
                                        <div class="explore-all-story">
                                            <a href="/stories/467140" class="avatar with-story"></a>
                                            <a href="/pulicapus" class="name">Андрей Багрянцев</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="explore-wrapper all">
                            <Post v-for="post in posts" :post="post" :key="post.id" from="explore" />
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
import Navigate from "./common/Navigate";
import InfinityScrollMixin from "@/mixins/infinityScroll";

export default {
  name: "Explore",
  components: {
    MobileHeader: MobileHeader,
    Navigate: Navigate,
    Post
  },
  mixins: [InfinityScrollMixin],
  created() {
    this.$store.dispatch("explore/resetPageState");
    this.$store.dispatch("explore/getPosts");
  },
  computed: {
    posts() {
      return this.$store.state.explore.posts;
    },
    store() {
      // uses into InfinityScrollMixin
      return this.$store.state.explore;
    },
    shouldShowNoPosts() {
      const { loading, posts } = this.$store.state.explore;
      return !loading && !posts.length;
    }
  },
  methods: {
    infinityScrollGetDataMethod() {
      // uses into InfinityScrollMixin
      this.$store.dispatch("explore/getPosts");
    }
  }
};
</script>
