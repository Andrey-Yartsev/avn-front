<template>
  <video
    disableremoteplayback
    webkit-playsinline
    playsinline
    controls
    autoplay
    :poster="media.preview.source"
    v-if="video"
    @play="play"
    @pause="calcDuration"
  >
    <source :src="video.source" type="video/mp4" />
  </video>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";
import Logger from "js-logger";

const logger = Logger.get("stat");

export default {
  name: "Video",
  mixins: [PostMediaPropsMixin],
  props: {
    postId: Number,
    authorId: Number
  },
  data() {
    return {
      video: this.media.src,
      playTimer: 0,
      playDuration: 0
    };
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
    },
    calcDuration() {
      this.playDuration =
        this.playDuration + new Date().getTime() - this.playTimer;
    }
  },
  beforeDestroy() {
    this.calcDuration();
    const duration = Math.round(this.playDuration / 1000);
    logger.info(
      `send video view duration for post ${this.postId} (${duration})`
    );
    this.$root.ws.send({
      act: "collect",
      message: "view_video",
      data: {
        post_id: this.postId,
        owner: this.authorId,
        duration: duration,
        start_time: Math.round(this.playTimer / 1000)
      }
    });
  }
};
</script>
