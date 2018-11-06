<template>
  <div class="posts">
    <Post
      v-for="post in items"
      v-bind:key="post.id"
      :post="post"
      from="search/page"
    />
  </div>
</template>

<script>
import Post from "@/components/post/MediumView";

export default {
  name: "SearchPosts",

  props: ["items", "query", "loading"],

  components: {
    Post
  }
};
</script>
