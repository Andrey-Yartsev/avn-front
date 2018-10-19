<template>
  <div class="photoCollectionView">
    <div class="explore-wrapper photos">
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
