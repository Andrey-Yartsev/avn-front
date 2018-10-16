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
  }
};
