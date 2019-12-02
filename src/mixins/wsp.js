import wsp from "@/ws/wsp";
import ws from "@/ws";

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
      this.$store.dispatch("post/reloadPost", { postId });
    },
    reloadMedia(data) {
      this.$store.dispatch("profile/media/updateMediaSrc", data);
    }
  },
  created() {
    wsp.on("reloadPost", this.reloadPost);
    ws.on("reloadPost", this.reloadPost);
    wsp.on("reloadMedia", this.reloadMedia);
    ws.on("reloadMedia", this.reloadMedia);
  },
  beforeDestroy() {
    wsp.removeListener("reloadPost", this.reloadPost);
    ws.removeListener("reloadPost", this.reloadPost);
    wsp.removeListener("reloadMedia", this.reloadMedia);
    ws.removeListener("reloadMedia", this.reloadMedia);
  },
  watch: {
    posts() {
      this.sendObservedIds();
    }
  }
};
