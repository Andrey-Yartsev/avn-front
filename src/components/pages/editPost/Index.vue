<template>
  <div class="addPostPage">
    <EditPost :initialExpanded="true" :close="close" :post="post" />
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Footer from "@/components/footer/Index";
import EditPost from "@/components/addPost/Edit";

export default {
  name: "EditPostPage",
  components: {
    Footer,
    EditPost
  },
  computed: {
    post() {
      return this.$store.state.postPage.posts[0];
    }
  },
  methods: {
    close() {
      this.$router.push("/");
    }
  },
  created() {
    const postId = +this.$route.params.id;
    this.$store.dispatch("postPage/getPost", { postId });
  }
};
</script>
