export default {
  computed: {
    delayedPost() {
      return !!this.post.scheduledDate;
    },
    user() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    openModal() {
      if (this.delayedPost) {
        return;
      }

      if (!this.user) {
        this.$store.dispatch("modal/show", {
          name: "signup"
        });
        return;
      }

      if (!this.post.canViewMedia) {
        this.showSubscribeModal();
        return;
      }

      if (!this.post.isMediaReady) {
        return;
      }

      if (this.shouldBePoster) {
        this.$router.push(
          `/explore/videos#m/post/${this.post.id}/${this.from}`
        );
        return;
      }

      this.goToModalRoute(`post/${this.post.id}/${this.from}`);
    },
    showSubscribeModal(onSuccess) {
      window.onSubscriptionSuccess = () => {
        if (onSuccess) {
          onSuccess();
        }
        this.$store.dispatch(this.actionPrefix + "/reloadPost", this.post.id);
      };
      this.$store.dispatch("subscription/openSubscribeModal", this.post.author);
    }
  }
};
