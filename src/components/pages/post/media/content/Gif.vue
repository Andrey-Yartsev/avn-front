<template>
    <router-link class="postLink" :to="`/post/${postId}`">
        <div class="gif-player">
            <img :src="media.preview.source">
        </div>
    </router-link>
</template>

<script>
export default {
  name: "Gif",
  props: {
    media: {
      type: Object,
      required: true
    },
    postId: {
      type: Number,
      default: undefined
    }
  }
};
</script>
