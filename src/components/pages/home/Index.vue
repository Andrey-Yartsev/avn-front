<template>
    <div class="feed">
        <MobileHeader></MobileHeader>
        <a class="addPost-btn-float hidden-desktop" href="/addPost"></a>
        <div class="container">
            <div class="row">
                <div class="content-col">
                    <div class="rounded-container shadow-block no-padding">
                        <AddPost></AddPost>
                        <div class="feed">
                          <PostCollection
                            :posts="posts"
                            from="home"
                          />
                        </div>
                    </div>
                </div>
                <div class="aside-col aside-col_with-footer">
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

export default {
  name: "HomePage",
  components: {
    MobileHeader,
    Footer,
    StoriesWrapper,
    AddPost,
    PostCollection
  },
  mixins: [InfinityScrollMixin],
  created() {
    this.$store.dispatch("home/resetPageState");
    this.$store.dispatch("home/getPosts");
  },
  computed: {
    posts() {
      return this.$store.state.home.posts;
    },
    store() {
      // uses into InfinityScrollMixin
      return this.$store.state.home;
    }
  },
  methods: {
    infinityScrollGetDataMethod() {
      // uses into InfinityScrollMixin
      this.$store.dispatch("home/getPosts");
    }
  }
};
</script>
