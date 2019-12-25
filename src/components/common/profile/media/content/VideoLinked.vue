<template>
  <a class="postLink" :href="`/post/${postId}`" @click.prevent="openModal">
    <span class="video-placeholder icn-item">
      <img
        :src="src"
        style="height: 350px"
        @contextmenu.prevent="() => false"
        @dragstart.prevent="() => false"
      />
    </span>
  </a>
</template>

<script>
export default {
  name: "VideoLinkedMedia",
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
      default: () => {}
    },
    mediaSize: {
      type: String,
      default: "full"
    }
  },
  computed: {
    src() {
      return this.media.thumb.source;
    }
  }
};
</script>
