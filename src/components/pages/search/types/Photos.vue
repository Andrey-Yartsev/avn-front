<template>
  <div class="explore-wrapper photos">
    <Video
      v-for="post in items"
      v-bind:key="post.id"
      :post="post"
      from="search/page"
    />
  </div>
</template>

<script>
import Video from "@/components/post/SmallView";

export default {
  name: "SearchPosts",

  props: ["items", "query", "loading"],

  components: {
    Video
  }
};
</script>
