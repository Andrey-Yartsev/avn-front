import tokenRequest from "@/utils/tokenRequest";

export default {
  getPosts({ offset, limit, marker, source }) {
    return tokenRequest(`posts/${source}`, {
      method: "GET",
      query: {
        offset,
        limit,
        marker
      }
    });
  }
};
