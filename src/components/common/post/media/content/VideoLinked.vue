<template>
  <router-link class="postLink" :to="`/post/${postId}`">
    <span class="video-placeholder">
      <img :src="media.thumb.source" @click.prevent.stop="openModal">
    </span>
  </router-link>
</template>

<script>
export default {
  name: "VideoLinked",
  props: {
    media: {
      type: Object,
      required: true
    },
    postId: {
      type: Number,
      default: undefined
    },
    openModal: {
      type: Function,
      default: undefined
    }
  }
};
</script>
