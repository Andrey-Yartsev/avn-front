import request from "@/utils/tokenRequest";

export default {
  fetch() {
    return request(`sessions`, {
      method: "GET"
    });
  },
  delete(id) {
    return request(`sessions/${id}`, {
      method: "DELETE"
    });
  }
};
