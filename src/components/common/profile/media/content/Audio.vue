<template>
  <div class="postLink" @click="$emit('click')">
    <div
      class="media-wrapper audio-wrapper"
      :class="{ 'full-width': mediaSize === 'full' && $mq === 'desktop' }"
    >
      <img src="/static/img/volume.svg" />
      <audio controls controlsList="nodownload" :src="source"></audio>
    </div>
  </div>
</template>

<script>
export default {
  name: "Audio",
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
};
</script>

<style lang="scss" scoped>
.audio-wrapper {
  padding: 20px;
  background-color: white;
  &.full-width {
    width: 500px;
  }
  img {
    display: block;
    width: 100px !important;
    position: relative;
  }
  audio {
    width: 100%;
  }
}
</style>
