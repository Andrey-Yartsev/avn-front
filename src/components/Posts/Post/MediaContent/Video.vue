<template>
  <video disableremoteplayback webkit-playsinline playsinline controls :poster="media.preview.source">
      <source v-for="(videoSrc, videoType) in media.video" :src="videoSrc" :type="`video/${videoType}`" :key="videoType">
  </video>
</template>

<script>
export default {
  name: "Video",
  props: {
    media: {
      type: Object,
      required: true
    }
  }
};
</script>
