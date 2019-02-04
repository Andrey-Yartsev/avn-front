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
  blockUser({ userId, storyId }) {
    return tokenRequest(`stories/${storyId}/users/${userId}/block`, {
      method: "PUT"
    });
  },
  unblockUser({ userId, storyId }) {
    return tokenRequest(`stories/${storyId}/users/${userId}/block`, {
      method: "DELETE"
    });
  }
};
