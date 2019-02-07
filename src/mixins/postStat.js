export default {
  data() {
    return {
      postsStatViewActionTimeoutId: null,
      postsStatViewed: []
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
        if (this.postsStatViewed.indexOf(post.id) !== -1) {
          return;
        }
        const postTop = el.getBoundingClientRect().top;
        if (postTop + 40 > winHeight) {
          return;
        }
        this.postStatView(post);
      });
    },
    postStatView(post) {
      if (!this.$root.ws) return;

      this.postsStatViewed.push(post.id);
      this.$root.ws.send({
        act: "collect",
        message: "view_post_in_feed",
        data: {
          post_id: post.id,
          owner: post.author.id,
          duration: 1
        }
      });
    }
  },
  mounted() {
    this.postsStatViewAction();
    window.addEventListener("scroll", this.postsStatViewAction, true);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.postsStatViewAction, true);
  }
};
