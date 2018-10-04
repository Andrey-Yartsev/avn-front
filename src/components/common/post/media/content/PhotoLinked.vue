<template>
    <router-link class="postLink" :to="`/post/${postId}`">
       <img :src="media.preview.source" @click.prevent.stop="openModal">
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
    },
    openModal: {
      type: Function,
      default: undefined
    }
  }
};
</script>
