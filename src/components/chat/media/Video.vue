<template>
  <div
    class="video-placeholder icn-item"
    :class="{ processing, 'show-player': showPlayer }"
    @click="play"
  >
    <div
      class="lds-dual-ring transparent small with-text not-fullscreen processing-loader rounded-corners"
      v-if="processing"
    >
      <div class="loader-text">Media is currently processing</div>
    </div>
    <video
      disableremoteplayback
      webkit-playsinline
      autoplay
      playsinline
      controls
      :poster="media.preview.source"
      @play="play"
      ref="video"
      class="rounded-corners media-content"
      @contextmenu.prevent="() => false"
      @dragstart.prevent="() => false"
    >
      <source :src="media.src.source" type="video/mp4" />
    </video>
  </div>
</template>
<script>
export default {
  props: {
    message: Object
  },
  data() {
    return {
      showPlayer: false
    };
  },
  computed: {
    media() {
      return this.message.media[0];
    },
    processing() {
      return !this.message.isMediaReady;
    }
  },
  methods: {
    play() {
      if (this.media.locked) {
        return;
      }
      if (this.processing) {
        return;
      }
      this.showPlayer = true;
      this.$refs.video.play();
      this.$emit("play");
    },
    cancelPlay() {
      if (!this.showPlayer) {
        return;
      }
      this.$refs.video.pause();
      this.showPlayer = false;
    }
  }
};
</script>
