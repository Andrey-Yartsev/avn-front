import tokenRequest from "@/utils/tokenRequest";

export default {
  getPosts({ offset, limit, marker, source }) {
    return tokenRequest(`stories/${source}/viewers`, {
      method: "GET",
      query: {
        offset,
        limit,
        marker
      }
    });
  },
  blockUser({ userId }) {
    return tokenRequest(`users/${userId}/stories/block`, {
      method: "POST"
    });
  },
  unblockUser({ userId }) {
    return tokenRequest(`users/${userId}/stories/block`, {
      method: "DELETE"
    });
  }
};
