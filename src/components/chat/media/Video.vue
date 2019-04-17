<template>
  <div
    class="video-placeholder"
    :class="{ processing, 'show-player': showPlayer }"
    @click="play"
  >
    <template v-if="media.locked">
      <img
        v-show="!showPlayer"
        class="video-preview"
        :src="'data:image/jpeg;base64,' + media.locked"
        :width="media.preview.width"
        :height="media.preview.height"
      />
    </template>
    <template v-else>
      <div
        class="lds-dual-ring transparent small with-text not-fullscreen"
        v-if="processing"
      >
        <div class="loader-text">Media is currently processing</div>
      </div>

      <img
        v-show="!showPlayer"
        class="video-preview"
        :src="media.preview.source"
        :width="media.preview.width"
        :height="media.preview.height"
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

<style>
.processing .lds-dual-ring .loader-text {
  color: #fff !important;
}

.processing .lds-dual-ring:before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.video-placeholder.show-player:after,
.video-placeholder.processing:after {
  display: none;
}
</style>
