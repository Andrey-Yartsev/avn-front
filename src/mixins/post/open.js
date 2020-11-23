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
      if (this.post.isExpired && this.post.author.expiredUnlockPrice) {
        this.showExpiredUnlockModal();
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
    },
    showExpiredUnlockModal() {
      const onSuccess = () => {
        this.$store.commit("profile/home/resetPosts");
        this.$store.dispatch("profile/home/getPosts");
      };
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: `Posts that are older than ${
            this.post.author.expiredPeriod
          } of days are not included in your subscription. Unlock all older posts for a one-time fee of $${
            this.post.author.expiredUnlockPrice
          }`,
          success: () => {
            this._pay(
              {
                paymentType: "posts_unblock",
                userId: this.post.author.id,
                amount: parseFloat(this.post.author.expiredUnlockPrice),
                paymentGateCustomerCardToken: this.user
                  .paymentGateCustomerCardToken
              },
              onSuccess
            );
          }
        }
      });
    }
  }
};
