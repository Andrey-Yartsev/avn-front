import Logger from "js-logger";

const arrayToObject = array =>
  array.reduce((obj, item) => {
    obj[item.id] = item;
    return obj;
  }, {});

const logger = Logger.get("stat");

export default {
  data() {
    return {
      postsStatViewActionTimeoutId: null,
      postsStatViewed: [],
      postsStatAppearedIds: [],
      postsStatTimers: {},
      postsMap: {}
    };
  },
  methods: {
    postsStatViewAction() {
      if (this.postsStatViewActionTimeoutId) {
        clearTimeout(this.postsStatViewActionTimeoutId);
      }
      this.postsStatViewActionTimeoutId = setTimeout(() => {
        this._postsStatViewAction();
      }, 1000);
    },
    postsStatFinishViewAction() {
      this.postsStatAppearedIds.forEach(postId =>
        this.finishPostWatchTimer(postId)
      );
    },
    _postsStatViewAction() {
      const winHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      this.posts.forEach(post => {
        const el = document.getElementById("p" + post.id);
        if (!el) {
          return;
        }
        let minus = 0;
        const commentEls = el.getElementsByClassName("postComments");
        if (commentEls.length) {
          minus = commentEls[0].getBoundingClientRect().height - 20;
        }
        const rect = el.getBoundingClientRect();
        const postBottom = rect.bottom - minus - 20;

        if (postBottom < winHeight) {
          this.postAppeared(post.id);
        }
        if (postBottom - 70 < 0 || postBottom > winHeight) {
          this.postDisappeared(post.id);
        }
      });
    },
    postAppeared(postId) {
      if (this.postsStatAppearedIds.indexOf(postId) !== -1) {
        return;
      }
      this.postsStatAppearedIds.push(postId);
      this.startPostWatchTimer(postId);
      logger.info(`post ${postId} appeared`);
    },
    postDisappeared(postId) {
      if (this.postsStatAppearedIds.indexOf(postId) === -1) {
        return;
      }
      this.postsStatAppearedIds = this.postsStatAppearedIds.filter(
        id => id !== postId
      );
      this.finishPostWatchTimer(postId);
      logger.info(`post ${postId} disappeared`);
    },
    startPostWatchTimer(postId) {
      this.postsStatTimers[postId] = new Date().getTime();
    },
    finishPostWatchTimer(postId) {
      let time = new Date().getTime() - this.postsStatTimers[postId];
      time = Math.floor(time / 1000);
      logger.info(`time for ${postId}: ${time}`);
      this.sendStat(postId, time);
      delete this.postsStatTimers[postId];
    },
    sendStat(postId, duration) {
      if (!duration) return;
      if (!this.$root.ws) return;

      this.$root.ws.send({
        act: "collect",
        message: "view_post_in_feed",
        data: {
          post_id: postId,
          owner: this.postsMap[postId].author.id,
          duration,
          start_time: Math.round(this.postsStatTimers[postId] / 1000)
        }
      });

      logger.info(`stat sent for ${postId}`);
    }
  },
  watch: {
    posts(posts) {
      this.postsMap = arrayToObject(posts);
    }
  },
  mounted() {
    this.postsStatViewAction();
    window.addEventListener("scroll", this.postsStatViewAction, true);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.postsStatViewAction, true);
    this.postsStatFinishViewAction();
  }
};
