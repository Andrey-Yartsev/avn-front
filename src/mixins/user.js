export default {
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    isLogedUser() {
      return !!this.$store.state.auth.user;
    },
    isMonetizedUser() {
      return this.user?.canEarn && this.user?.canPayoutsRequest;
    },
    isFullyMonetizedUser() {
      return (
        this.user.canEarn &&
        this.user.canPayoutsRequest &&
        (this.user.subscribePrice && parseFloat(this.user.subscribePrice) > 0)
      );
    }
  },
  methods: {
    isOwner: function(id) {
      if (this.user) {
        return this.user.id === id;
      }

      return false;
    },
    isAuth: function() {
      return !!this.user;
    },
    isOnline(id) {
      return this.$store.state.online.users.indexOf(id) !== -1;
    }
  }
};
