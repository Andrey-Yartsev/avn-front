<template>
    <router-link class="postLink" :to="`/post/${postId}`">
       <img :src="media.preview.source">
    </router-link>
</template>

<script>
export default {
  name: "LinkedPhoto",
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
