export default {
  computed: {
    delayedPost() {
      return !!this.post.scheduledDate;
    }
  },
  methods: {
    openModal() {
      if (this.delayedPost) {
        return;
      }

      if (!this.post.canViewMedia) {
        this.showSubscribeModal();
        return;
      }

      if (!this.post.isMediaReady) {
        return;
      }

      this.goToModalRoute(`post/${this.post.id}/${this.from}`);
    },
    showSubscribeModal() {
      this.$store.dispatch("subscription/openSubscribeModal", this.post.author);
    }
  }
};
