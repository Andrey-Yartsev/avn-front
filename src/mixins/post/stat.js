import Logger from "js-logger";

const logger = Logger.get("stat");

export default {
  data() {
    return {
      postStatTimer: 0,
      postStatDuration: 0
    };
  },
  methods: {
    startTimer() {
      this.postStatTimer = new Date().getTime();
      logger.info("timer started");
    },
    stopTimer() {
      this.postStatDuration =
        this.postStatDuration +
        Math.floor(new Date().getTime() - this.postStatTimer);
      logger.info("timer stopped");
    },
    sendStat() {
      this.stopTimer();

      if (!this.$root.ws) return;

      this.$root.ws.send({
        act: "collect",
        message: "view_post",
        data: {
          post_id: this.post.id,
          owner: this.post.author.id,
          duration: this.postStatDuration,
          start_time: Math.round(this.postStatTimer / 1000)
        }
      });

      logger.info("stat sent");
    },
    visibilityChange() {
      if (document.hidden) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
    }
  },
  mounted() {
    this.startTimer();
    document.addEventListener("visibilitychange", this.visibilityChange);
  },
  beforeDestroy() {
    this.sendStat();
    document.removeEventListener("visibilitychange", this.visibilityChange);
  }
};
