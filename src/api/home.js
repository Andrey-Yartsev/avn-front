import request from "@/utils/request";

export default {
  getPosts(data = { offset: 200, limit: 100 }) {
    return request(`posts/feed?offset=${data.offset}&limit=${data.offset}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
  }
};
