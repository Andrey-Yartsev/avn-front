import anyRequest from "@/utils/anyRequest";

export default {
  getPosts({ offset, limit, marker }) {
    return anyRequest(`streams`, {
      method: "GET",
      query: {
        offset,
        limit,
        marker
      }
    });
  }
};
