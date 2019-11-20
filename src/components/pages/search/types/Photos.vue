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
import Video from "@/components/post/view/SmallView";
import PostsStat from "@/mixins/post/statMany";

export default {
  name: "SearchPosts",

  props: ["items", "query", "loading"],

  mixins: [PostsStat],

  components: {
    Video
  },

  computed: {
    posts() {
      return this.items;
    }
  }
};
</script>
