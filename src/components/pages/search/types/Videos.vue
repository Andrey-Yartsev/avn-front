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
import Video from "@/components/post/view/SmallView";
import PostMedium from "@/components/post/view/MediumView";

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
