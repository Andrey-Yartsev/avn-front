import ws from "@/ws";

export default {
  methods: {
    reloadPost(postId) {
      this.$store.dispatch("post/reloadPost", { postId });
    },
    reloadMedia(data) {
      this.$store.dispatch("profile/media/updateMediaSrc", data);
    },
    reloadMediaPreview(data) {
      this.$store.dispatch("profile/media/updateMediaPreviewSrc", data);
    }
  },
  created() {
    ws.on("reloadPost", this.reloadPost);
    ws.on("reloadMedia", this.reloadMedia);
    ws.on("reloadMediaPreview", this.reloadMediaPreview);
  },
  beforeDestroy() {
    ws.removeListener("reloadPost", this.reloadPost);
    ws.removeListener("reloadMedia", this.reloadMedia);
    ws.removeListener("reloadMediaPreview", this.reloadMediaPreview);
  }
};
