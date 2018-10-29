<template>
  <div class="addPostPage">
    <AddPost :initialExpanded="true" />
    <Footer />
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
  }
};
</script>
