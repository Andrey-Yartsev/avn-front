<template>
  <div class="postPageWrapper postPageWrapper_in-page mediaPage">
    <MediaLarge v-if="media" :post="media" :from="from" />
  </div>
</template>

<script>
import MediaLarge from "@/components/common/profile/media/views/MediaLarge";

export default {
  name: "PostPage",
  data() {
    return {
      extraClassName: "lightbox-post scroll-post"
    };
  },
  computed: {
    from() {
      return "/";
    },
    media() {
      return this.$store.state.mediaPage.media;
    }
  },
  components: {
    MediaLarge
  }
};
</script>
