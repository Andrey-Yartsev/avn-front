import request from "@/utils/request";

export default {
  getPosts(data) {
    return request(`posts/feed?offset=${data.offset}&limit=${data.limit}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
  }
};
