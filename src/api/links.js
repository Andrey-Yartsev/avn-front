import tokenRequest from "@/utils/tokenRequest";
import anyRequest from "@/utils/anyRequest";

export default {
  getLinks(userId) {
    return anyRequest(`links/${userId}`, {
      method: "GET"
    });
  },
  postLink(data) {
    return tokenRequest(`links`, {
      method: "POST",
      data: data
    });
  },
  updateLink(data) {
    return tokenRequest(`links/${data.id}`, {
      method: "PUT",
      data: data
    });
  },
  deleteLink(id) {
    return tokenRequest(`links/${id}`, {
      method: "DELETE"
    });
  }
};
