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
    <source
      v-for="(videoSrc, videoType) in video"
      :src="videoSrc"
      :type="`video/${videoType}`"
      :key="videoType"
    />
  </video>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "Video",
  mixins: [PostMediaPropsMixin],
  data() {
    return {
      video: this.media.video
    };
  },
  watch: {
    media() {
      this.video = undefined;
      setTimeout(() => {
        this.video = this.media.video;
      }, 100);
    }
  }
};
</script>
