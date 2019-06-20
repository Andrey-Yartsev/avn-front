<template>
  <div
    class="video-placeholder icn-item rounded-corners"
    :class="{ processing, 'show-player': showPlayer }"
    @click="play"
    :style="{
      width: `100%`,
      'max-width': `${media.preview.width}px`,
      'max-height': `${media.preview.height}px`
    }"
  >
    <template v-if="media.locked">
      <img
        v-show="!showPlayer"
        class="video-preview rounded-corners media-content"
        :src="'data:image/jpeg;base64,' + media.locked"
        :width="media.preview.width"
        :height="media.preview.height"
        :style="{
          'max-width': `${media.preview.width}px`,
          width: `auto`,
          'max-height': `${media.preview.height}px`
        }"
      />
    </template>
    <template v-else>
      <div
        class="lds-dual-ring transparent small with-text not-fullscreen processing-loader"
        v-if="processing"
      >
        <div class="loader-text">Media is currently processing</div>
      </div>

      <img
        class="video-preview rounded-corners media-content"
        :src="media.preview.source"
        :width="media.preview.width"
        :height="media.preview.height"
        :style="{
          'max-width': `${media.preview.width}px`
        }"
      />

      <video
        v-show="showPlayer"
        disableremoteplayback
        webkit-playsinline
        playsinline
        controls
        :poster="media.preview.source"
        @play="play"
        ref="video"
        class="rounded-corners media-content"
        :style="{
          width: `100%`,
          'max-width': `${media.preview.width}px`
        }"
      >
        <source :src="media.src.source" type="video/mp4" />
      </video>
    </template>
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
