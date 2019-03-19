<template>
  <div class="container addPostPage">
    <div class="rounded-container">
      <EditPost
        :initialExpanded="true"
        :close="close"
        :post="post"
        where="editPage"
        type="edit"
      />
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Footer from "@/components/footer/Index";
import EditPost from "@/components/addPost/Index";

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
  },
  beforeDestroy() {
    this.$store.dispatch("postPage/resetPageState");
  }
};
</script>
