<template>
  <div class="addPostPage">
    <AddPost :initialExpanded="true" :close="close" where="modal" />
    <div class="feed rounded-container shadow-block reset-btr">
      <PostCollection :posts="delayedPosts" from="queue" />
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Footer from "@/components/footer/Index";
import AddPost from "@/components/addPost/Index";
import PostCollection from "@/components/common/postCollection/Index";

export default {
  name: "AddPostPage",
  components: {
    Footer,
    AddPost,
    PostCollection
  },
  computed: {
    delayedPosts() {
      return this.$store.state.postQueue.posts;
    }
  },
  methods: {
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
