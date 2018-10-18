<template>
  <div class="videoCollectionView">
    <div class="explore-wrapper videos">
      <Video
        v-for="post in items"
        v-bind:key="post.id"
        :post="post"
        from="search"
      />
    </div>
    <NoResults :query="query" :loading="loading" />
  </div>
</template>

<script>
import NoResults from "./NoResults";
import Video from "@/components/post/SmallView";

export default {
  name: "SearchPosts",

  props: ["items", "query", "loading"],

  components: {
    Video,
    NoResults
  }
};
</script>
