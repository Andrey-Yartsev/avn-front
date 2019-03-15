<template>
  <div class="addPostPage">
    <AddPost :initialExpanded="true" :close="close" where="modal" />
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Footer from "@/components/footer/Index";
import AddPost from "@/components/addPost/Index";

export default {
  name: "AddPostPage",
  components: {
    Footer,
    AddPost
  },
  methods: {
    close() {
      this.$router.push("/");
    }
  }
};
</script>
