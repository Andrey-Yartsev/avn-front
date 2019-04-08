import wsp from "@/ws/wsp";

export default {
  data: () => ({
    alreadySent: ""
  }),
  methods: {
    checkNonReadyPosts() {
      this.posts.map(post => {
        if (!post.isMediaReady) {
          wsp.reloadAction(post.id);
        }
      });
    },
    getObservedIds() {
      const allIds = this.posts.map(p => p.id);
      const sent = this.alreadySent.split(",");
      const shouldBePosted = allIds.filter(id => sent.indexOf(`${id}`) === -1);
      return shouldBePosted.join(",");
    },
    sendObservedIds() {
      const ids = this.getObservedIds();
      if (!ids.length) return;
      this.alreadySent = !this.alreadySent ? ids : `${this.alreadySent},${ids}`;
      wsp.send(ids);
    },
    reloadPost(postId) {
      console.log("reloadPost");
      this.$store.dispatch("post/updatePost", { postId });
    }
  },
  created() {
    wsp.on("reloadPost", this.reloadPost);
  },
  beforeDestroy() {
    wsp.removeListener("reloadPost", this.reloadPost);
  },
  watch: {
    posts() {
      this.sendObservedIds();
    }
  }
};
