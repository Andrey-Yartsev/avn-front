<template>
  <div class="postLink" @click="$emit('click')">
    <div class="media-wrapper">
      <audio
        controls
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      ></audio>
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
