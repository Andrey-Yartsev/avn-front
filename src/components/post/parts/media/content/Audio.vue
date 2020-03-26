<template>
  <div class="postLink" @click="$emit('click')">
    <div class="media-wrapper audio-wrapper">
      <audio controls controlsList="nodownload" :src="media.src.source"></audio>
      <!-- <audio
        controls
        :src="src"
        :style="style"
        @load="() => (loaded = true)"
      ></audio> -->
    </div>
  </div>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/post/media";

export default {
  name: "Audio",
  mixins: [PostMediaPropsMixin],
  data: () => ({
    loaded: false
  }),
  computed: {
    style() {
      return !this.loaded ? { opacity: "0" } : {};
    }
  },
  watch: {
    src() {
      this.loaded = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.audio-wrapper {
  padding: 20px;
  & > audio {
    width: 100%;
  }
}
</style>
