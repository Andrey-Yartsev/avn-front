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
  }
};
