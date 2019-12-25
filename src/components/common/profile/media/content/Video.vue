<template>
  <div class="media-wrapper">
    <video
      class="video-content"
      :class="{ halfHeight: $mq === 'desktop' }"
      disableremoteplayback
      webkit-playsinline
      playsinline
      controls
      controlslist="nodownload"
      :autoplay="autoplay"
      loop
      :poster="media.thumb.source"
      v-if="video"
      @play="play"
      @contextmenu.prevent="() => false"
      @dragstart.prevent="() => false"
      ref="video"
    >
      <source :src="video.source" type="video/mp4" />
    </video>
  </div>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/post/media";

export default {
  name: "Video",
  mixins: [PostMediaPropsMixin],
  props: {
    post: Object,
    authorId: Number,
    autoplay: Boolean,
    media: Object
  },
  data() {
    return {
      video: this.media.src,
      playTimer: 0,
      playDuration: 0
    };
  },
  computed: {
    videoHeight() {
      const ratio = global.innerWidth / this.media.preview.width;
      return this.media.preview.height * ratio;
    }
  },
  watch: {
    media() {
      this.video = undefined;
      setTimeout(() => {
        this.video = this.media.src;
      }, 100);
    }
  },
  methods: {
    play() {
      this.playTimer = new Date().getTime();
      this.$emit("playCallback");
    }
  }
};
</script>

<style lang="scss" scoped>
.video-content {
  width: 100%;
  height: 360px;
  &.halfHeight {
    height: 50vh !important;
  }
}
</style>
