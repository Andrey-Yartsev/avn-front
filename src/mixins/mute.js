export default {
  methods: {
    _canMute(user) {
      if (!user.followedOn && !user.subscribedOn) {
        return false;
      }
      return true;
    }
  }
};
