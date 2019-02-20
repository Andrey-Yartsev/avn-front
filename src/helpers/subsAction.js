export default profile => {
  if (!profile.subscribedBy) {
    return "subscribe";
  } else if (profile.subscribedBy && !profile.subscribedByExpire) {
    return "unsubscribe";
  } else if (profile.subscribedBy && profile.subscribedByExpire) {
    return "resubscribe";
  }
};
