<template>
  <div :class="['new-post-toast', { show: !!newPosts }]" @click="init">
    <span>See {{ newPosts }} new post</span>
  </div>
</template>

<script>
export default {
  name: "NewFeedPostToast",
  props: {
    newPosts: {
      type: Number,
      required: true
    },
    init: {
      type: Function,
      required: true
    }
  }
};
</script>
