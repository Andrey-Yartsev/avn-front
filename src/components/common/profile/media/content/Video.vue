<template>
  <div class="media-wrapper">
    <video
      disableremoteplayback
      webkit-playsinline
      playsinline
      controls
      controlslist="nodownload"
      :autoplay="autoplay"
      loop
      :poster="media.preview.source"
      v-if="video"
      @play="play"
      :height="videoHeight"
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
    autoplay: Boolean
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