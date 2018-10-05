<template>
    <router-link class="postLink" :to="`/post/${postId}`">
        <div class="gif-player" @click.prevent.stop="openModal">
            <img :src="media.preview.source">
            <img class="gif-img" :src="media.src.source">
        </div>
    </router-link>
</template>

<script>
export default {
  name: "GifLinked",
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
