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
import MobileHeader from "../../header/Mobile";
import Footer from "../../footer/Index";
import AddPost from "../../addPost/Index";
import StoriesWrapper from "../../aside/StoriesWrapper";
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
      return this.$store.state.home;
    }
  },
  methods: {
    infinityScrollGetDataMethod() {
      this.$store.dispatch("home/getPosts");
    }
  }
};
</script>
