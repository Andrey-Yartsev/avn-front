<template>
  <div class="explore-wrapper clips">
    <template v-if="items.length">
      <component
        :is="mediaComponent"
        v-for="post in posts"
        :post="post"
        :key="post.id"
        from="search/page"
        :showPin="false"
      />
    </template>
  </div>
</template>

<script>
import MediaMedium from "@/components/common/profile/media/views/MediaMedium";
import MediaSmall from "@/components/common/profile/media/views/MediaSmall";

export default {
  name: "SearchClips",

  props: ["items", "query", "loading"],

  components: {
    MediaMedium,
    MediaSmall
  },

  computed: {
    posts() {
      return this.items;
    },
    mediaComponent() {
      return this.$mq === "mobile" ? MediaMedium : MediaSmall;
    }
  }
};
</script>
