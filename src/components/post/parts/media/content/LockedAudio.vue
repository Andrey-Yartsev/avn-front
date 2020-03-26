<template>
  <div
    class="locked-picture icn-item icn-pos_center"
    @click.prevent="openModal"
  >
    <div class="postLink" @click="$emit('click')">
      <div class="media-wrapper audio-wrapper">
        <audio controls controlsList="nodownload" :src="src"></audio>
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
  .blocker {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  & > audio {
    width: 100%;
  }
}
</style>
