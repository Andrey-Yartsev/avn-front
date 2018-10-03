<template>
    <div class="feed">
        <MobileHeader></MobileHeader>
        <a class="addPost-btn-float hidden-desktop" href="/addPost"></a>
        <div class="container">
            <div class="row">
                <div class="content-col">
                    <div class="rounded-container shadow-block no-padding">
                        <AddPost></AddPost>
                        <CollectionView :posts="posts"/>
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
import CollectionView from "./posts/CollectionView";
import MobileHeader from "../../header/Mobile";
import Footer from "../../footer/Index";
import AddPost from "../../addPost/Index";
import StoriesWrapper from "../../aside/StoriesWrapper";
import { getBottom } from "../../../helpers/page";

export default {
  name: "Home",
  components: {
    MobileHeader: MobileHeader,
    Footer: Footer,
    StoriesWrapper: StoriesWrapper,
    AddPost: AddPost,
    CollectionView: CollectionView
  },
  created() {
    this.$store.dispatch("home/resetPage");
    this.$store.dispatch("home/getPosts");
  },
  mounted() {
    window.addEventListener("scroll", this.onScrollHandler, true);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScrollHandler, true);
  },
  computed: {
    posts() {
      return this.$store.state.home.posts;
    }
  },
  methods: {
    onScrollHandler: function() {
      const { loading, allDataReceived } = this.$store.state.home;
      const isOnBottom = getBottom();
      if (isOnBottom && !loading && !allDataReceived) {
        this.$store.dispatch("home/getPosts");
      }
    }
  }
};
</script>
