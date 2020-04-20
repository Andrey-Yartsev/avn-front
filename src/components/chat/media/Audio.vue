<template>
  <div class="media media-item">
    <template v-if="$mq === 'mobile' && (message.isFree || message.isOpened)">
      <div class="media-wrapper audio-wrapper audio-chat-message">
        <audio
          controls
          controlsList="nodownload"
          :src="media.src.source"
        ></audio>
        <div class="overflow" @click.prevent="openAudio(media.src.source)" />
      </div>
    </template>
    <template v-else>
      <div class="media-wrapper audio-wrapper audio-chat-message">
        <audio
          controls
          controlsList="nodownload"
          :src="media.src.source"
        ></audio>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    message: Object
  },
  computed: {
    media() {
      return this.message.media[0];
    }
  },
  methods: {
    openAudio(src) {
      console.log("open");
      this.$store.dispatch("modal/show", {
        name: "audio",
        data: {
          src
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.audio-wrapper {
  position: relative;
  .overflow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
  }
  & > audio {
    width: 100%;
  }
}
</style>
