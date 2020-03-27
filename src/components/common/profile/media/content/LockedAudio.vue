<template>
  <div
    class="locked-picture icn-item icn-pos_center"
    @click.prevent="openModal"
  >
    <div class="postLink" @click="$emit('click')">
      <div
        class="media-wrapper audio-wrapper"
        :class="{ 'full-width': mediaSize === 'full' && $mq === 'desktop' }"
      >
        <img src="/static/img/volume.svg" />
        <audio controls controlsList="nodownload" :src="source"></audio>
        <div class="blocker" />
      </div>
    </div>
  </div>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/post/media";

export default {
  name: "LockedAudio",
  mixins: [PostMediaPropsMixin],
  props: {
    media: Object
  },
  computed: {
    src() {
      return this.media.src.source;
    }
  }
};
</script>

<style lang="scss" scoped>
.audio-wrapper {
  padding: 20px;
  position: relative;
  background-color: white;
  &.full-width {
    width: 500px;
  }
  .blocker {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
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
