<template>
  <video disableremoteplayback webkit-playsinline playsinline controls :poster="media.preview.source">
      <source v-for="(videoSrc, videoType) in media.video" :src="videoSrc" :type="`video/${videoType}`" :key="videoType">
  </video>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "Video",
  mixins: [PostMediaPropsMixin]
};
</script>
