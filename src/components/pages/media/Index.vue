<template>
  <div class="postPageWrapper postPageWrapper_in-page mediaPage">
    <MediaLarge v-if="media" :post="media" :from="from" />
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import MediaLarge from "@/components/common/profile/media/views/MediaLarge";
import Actions from "@/components/common/profile/media/footer/Actions";

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
    MediaLarge,
    Actions
  }
};
</script>
