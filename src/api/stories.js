import anyRequest from "@/utils/anyRequest";

export default {
  getPosts({ offset, limit, marker }) {
    return anyRequest(`stories`, {
      method: "GET",
      query: {
        offset,
        limit,
        marker
      }
    });
  },
  getUserStory({ userId }) {
    return anyRequest(`users/${userId}/stories/`, {
      method: "GET"
    });
  }
};
