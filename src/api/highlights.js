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
  },
  getCollection({ collectionId }) {
    return anyRequest(`stories/collections/${collectionId}`, {
      method: "GET"
    });
  },
  updateCollection({ collectionId, data }) {
    return anyRequest(`stories/collections/${collectionId}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  }
};
