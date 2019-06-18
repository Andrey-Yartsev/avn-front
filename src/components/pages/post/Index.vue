<template>
  <div class="postPageWrapper postPageWrapper_in-page">
    <Post v-if="post" :post="post" from="postPage" />
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Post from "@/components/post/LargeView";
import Footer from "@/components/footer/Index";

export default {
  name: "PostPage",
  computed: {
    post() {
      return this.$store.state.postPage.posts[0];
    }
  },
  components: {
    Post,
    Footer
  },
  created() {
    const postId = +this.$route.params.postId;
    this.$store.commit("postPage/resetPageState");
    this.$store.dispatch("postPage/getPost", { postId });
  }
};
</script>
