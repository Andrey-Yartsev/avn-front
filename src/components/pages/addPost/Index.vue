<template>
  <div
    class="container addPostPage"
    :class="{ hasScheduledPosts: delayedPosts.length }"
  >
    <div class="rounded-container">
      <AddPost :initialExpanded="true" :close="close" where="modal" />
      <div class="feed reset-btr">
        <PostCollection :posts="delayedPosts" from="postQueue" />
      </div>
      <div class="loaderWrap loader-content" v-if="infinityScrollLoading">
        <Loader :fullscreen="false" />
      </div>
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Footer from "@/components/footer/Index";
import AddPost from "@/components/addPost/Index";
import PostCollection from "@/components/common/postCollection/Index";
import InfinityScrollMixin from "@/mixins/infinityScroll";
import Loader from "@/components/common/Loader";

export default {
  name: "AddPostPage",
  components: {
    Footer,
    AddPost,
    PostCollection,
    Loader
  },
  mixins: [InfinityScrollMixin],
  computed: {
    delayedPosts() {
      return this.$store.state.postQueue.posts;
    },
    store() {
      // uses into InfinityScrollMixin
      return this.$store.state.postQueue;
    }
  },
  methods: {
    infinityScrollGetDataMethod() {
      this.$store.dispatch("postQueue/getPosts");
    },
    close() {
      this.$router.push("/");
    }
  },
  created() {
    this.$store.commit("postQueue/reset");
    this.$store.dispatch("postQueue/getPosts");
  }
};
</script>
