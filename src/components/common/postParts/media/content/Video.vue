<template>
  <video
    disableremoteplayback
    webkit-playsinline
    playsinline
    controls
    autoplay
    :poster="media.preview.source"
    v-if="video"
  >
    <source :src="video.source" type="video/mp4" />
  </video>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "Video",
  mixins: [PostMediaPropsMixin],
  data() {
    return {
      video: this.media.src
    };
  },
  watch: {
    media() {
      this.video = undefined;
      setTimeout(() => {
        this.video = this.media.src;
      }, 100);
    }
  }
};
</script>
