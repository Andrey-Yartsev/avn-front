export default {
  methods: {
    _isMuted(user) {
      if (!user || !user.followedOn) {
        return false;
      }
      if (user.followedOn && user.followedOn.isMuted) {
        return true;
      }
      return false;
    }
  }
};
