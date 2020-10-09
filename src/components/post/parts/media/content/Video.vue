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
      @pause="calcDuration"
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
import Logger from "js-logger";

const logger = Logger.get("stat");

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
    },
    calcDuration() {
      const playDuration = new Date().getTime() - this.playTimer;
      if (playDuration > 3 * 60 * 60 * 1000) {
        this.playDuration = 0;
        return;
      }
      this.playDuration = playDuration;
    }
  },
  beforeDestroy() {
    this.calcDuration();
    const duration = Math.round(this.playDuration / 1000);
    if (duration < 0) {
      return;
    }
    logger.info(
      `send video view duration for post ${this.post?.id} (${duration})`
    );
    this.$root.ws.send({
      act: "collect",
      message: "view_video",
      data: {
        post_id: this.post?.id,
        owner: this.authorId,
        duration: duration,
        start_time: Math.round(this.playTimer / 1000)
      }
    });
  }
};
</script>
