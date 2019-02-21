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
    },
    _canMute(user) {
      if (!user.followedOn && !user.subscribedOn) {
        return false;
      }
      return true;
    }
  }
};
