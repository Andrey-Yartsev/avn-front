<template>
  <div class="explore-wrapper videos">
    <component
      :is="videoComponent"
      v-for="post in items"
      v-bind:key="post.id"
      :post="post"
      from="search/page"
    />
  </div>
</template>

<script>
import Video from "@/components/post/SmallView";
import PostMedium from "@/components/post/MediumView";

export default {
  name: "SearchPosts",

  props: ["items", "query", "loading"],

  components: {
    Video,
    PostMedium
  },

  computed: {
    videoComponent() {
      return this.$mq === "mobile" ? PostMedium : Video;
    }
  }
};
</script>
