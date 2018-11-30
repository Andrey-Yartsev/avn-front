<template>
    <div class="feed">
        <MobileHeader></MobileHeader>
        <router-link
          class="addPost-btn-float hidden-desktop" to="/addPost"></router-link>
        <div class="container">
            <div class="row">
                <div class="content-col">
                  <div class="rounded-container shadow-block no-padding">
                    <AddPost :initialExpanded="true"></AddPost>
                    <div class="feed">
                      <PostCollection
                        :posts="posts"
                        from="home"
                      />
                    </div>
                  </div>
                </div>
                <div class="aside-col aside-col_sticky aside-col_sticky-al-bottom aside-col_with-footer">
                  <StoriesWrapper></StoriesWrapper>
                  <Footer></Footer>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PostCollection from "@/components/common/postCollection/Index";
import MobileHeader from "@/components/header/Mobile";
import Footer from "@/components/footer/Index";
import AddPost from "@/components/addPost/Index";
import StoriesWrapper from "@/components/aside/StoriesWrapper";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import Wsp from "@/mixins/wsp";

export default {
  name: "HomePage",
  components: {
    MobileHeader,
    Footer,
    StoriesWrapper,
    AddPost,
    PostCollection
  },
  mixins: [InfinityScrollMixin, Wsp],
  created() {
    this.init();
  },
  computed: {
    posts() {
      return this.$store.state.home.posts;
    },
    store() {
      // uses into InfinityScrollMixin
      return this.$store.state.home;
    },
    newPost() {
      return this.$store.state.post.newPost;
    },
    updatedPost() {
      return this.$store.state.post.updatedPost;
    }
  },
  methods: {
    infinityScrollGetDataMethod() {
      // uses into InfinityScrollMixin
      this.$store.dispatch("home/getPosts");
    },
    init() {
      this.$store.dispatch("home/resetPageState");
      this.$store.dispatch("home/getPosts");
      this.$store.dispatch("stories/resetPageState");
      this.$store.dispatch("stories/setSource", { source: "feed" });
      this.$store.dispatch("stories/getPosts");
    }
  },
  watch: {
    newPost() {
      this.$store.dispatch("modal/hide", { name: "addPost" });
      this.init();
    },
    updatedPost() {
      this.$store.dispatch("home/updatePost", this.updatedPost);
    }
  }
};
</script>
