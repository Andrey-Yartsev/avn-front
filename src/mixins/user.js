export default {
  methods: {
    isOwner: function(id) {
      if (this.$store.state.auth.user) {
        return this.$store.state.auth.user.id === id;
      }

      return false;
    }
  }
};
