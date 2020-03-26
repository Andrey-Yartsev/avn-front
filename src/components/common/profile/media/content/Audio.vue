<template>
  <div class="postLink" @click="$emit('click')">
    <div
      class="media-wrapper audio-wrapper"
      :class="{ 'full-width': mediaSize === 'full' && $mq === 'desktop' }"
    >
      <audio controls controlsList="nodownload" :src="source"></audio>
    </div>
  </div>
</template>

<script>
// import PostMediaPropsMixin from "@/mixins/post/media";

export default {
  name: "Audio",
  // mixins: [PostMediaPropsMixin],
  props: {
    mediaSize: String,
    media: {
      type: Object,
      required: true
    }
  },
  computed: {
    source() {
      if (this.media && this.media.src && this.media.src.source) {
        return this.media.src.source;
      }
      return "";
    }
  }
  // watch: {
  //   src() {
  //     this.loaded = false;
  //   }
  // }
};
</script>

<style lang="scss" scoped>
.audio-wrapper {
  padding: 20px;
  &.full-width {
    width: 500px;
  }
  & > audio {
    width: 100%;
  }
}
</style>
