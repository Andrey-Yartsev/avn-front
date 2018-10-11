<template>
  <Post v-if="post" :post="post" from="postPage" />
</template>

<script>
import Post from "@/components/post/LargeView";

export default {
  name: "PostPage",
  computed: {
    post() {
      return this.$store.state.postPage.posts[0];
    }
  },
  components: {
    Post
  },
  created() {
    const postId = +this.$route.params.postId;
    this.$store.dispatch("postPage/getPost", { postId });
  },
  watch: {
    post: function() {
      if (!this.post.comments) {
        this.$store.dispatch("postPage/getPostComments", {
          postId: this.post.id
        });
      }
    }
  }
};
</script>
