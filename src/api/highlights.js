import anyRequest from "@/utils/anyRequest";
// import tokenRequest from "@/utils/tokenRequest";
export default {
  getUserCollections({ offset, limit, marker, source }) {
    return anyRequest(`users/${source}/stories/collections/`, {
      method: "GET",
      query: {
        offset,
        limit,
        marker
      }
    });
  }
};
