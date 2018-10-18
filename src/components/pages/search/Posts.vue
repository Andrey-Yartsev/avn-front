<template>
  <div class="postCollectionView">
    <div class="posts">
      <Post
        v-for="post in items"
        v-bind:key="post.id"
        :post="post"
        from="home"
      />
    </div>
    <NoResults :query="query" :loading="loading" />
  </div>
</template>

<script>
import NoResults from "./NoResults";
import Post from "@/components/post/MediumView";

export default {
  name: "SearchPosts",

  props: ["items", "query", "loading"],

  components: {
    Post,
    NoResults
  }
};
</script>
