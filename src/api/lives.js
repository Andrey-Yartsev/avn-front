import anyRequest from "@/utils/anyRequest";

export default {
  getPosts({ offset, limit, marker, source, category }) {
    if (!category) {
      category = 1;
    }

    return anyRequest(`streams/${source}`, {
      method: "GET",
      query: {
        offset,
        limit,
        marker,
        category
      }
    });
  },
  getPostsWithStreams({ offset, limit, marker, source, category }) {
    if (!category) {
      category = 1;
    }

    return anyRequest(`streams/explore/${source}`, {
      method: "GET",
      query: {
        offset,
        limit,
        marker,
        category
      }
    });
  }
};
