export default profile => {
  if (!profile.subscribedBy) {
    return "subscribe";
  } else if (profile.subscribedBy && !profile.subscribedByProgress) {
    return "unsubscribe";
  } else if (profile.subscribedBy && profile.subscribedByProgress) {
    return "resubscribe";
  }
};
