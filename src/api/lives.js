import anyRequest from "@/utils/anyRequest";

export default {
  getPosts({ offset, limit, marker, source }) {
    return anyRequest(`streams/${source}`, {
      method: "GET",
      query: {
        offset,
        limit,
        marker
      }
    });
  }
};
