export default {
  methods: {
    _isMuted(user) {
      if (user.followedOn && user.followedOn.isMuted) {
        return true;
      }
      return false;
    }
  }
};
