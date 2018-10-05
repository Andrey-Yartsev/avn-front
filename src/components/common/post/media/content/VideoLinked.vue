<template>
  <a class="postLink" :href="`/post/${postId}`" @click.prevent="openModal">
    <span class="video-placeholder">
      <img :src="media.thumb.source" >
    </span>
  </a>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "VideoLinked",
  mixins: [PostMediaPropsMixin]
};
</script>
