import tokenRequest from "@/utils/tokenRequest";

export default {
  follow(userId) {
    return tokenRequest("subscriptions/follow", {
      method: "POST",
      data: { userId }
    });
  },
  unfollow(userId) {
    return tokenRequest("subscriptions/unfollow", {
      method: "DELETE",
      data: { userId }
    });
  }
};
