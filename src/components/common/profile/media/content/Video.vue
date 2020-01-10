<template>
  <div class="media-wrapper">
    <template v-if="showPreviewVideo">
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
        v-if="video"
        @play="play"
        @contextmenu.prevent="() => false"
        @dragstart.prevent="() => false"
        ref="video"
        :src="media.videoPreview.source"
        type="video/mp4"
      />
    </template>
    <template v-else>
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
        :src="video.source"
        type="video/mp4"
      />
    </template>
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
    media: Object,
    showPreview: Boolean,
    isAuthor: Boolean
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
    },
    showPreviewVideo() {
      if (
        this.$props.isAuthor &&
        this.$props.post.media.preview.source &&
        this.$props.showPreview
      ) {
        return true;
      }
      return false;
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
  margin: auto;
  &.halfHeight {
    height: 50vh !important;
  }
}
</style>
