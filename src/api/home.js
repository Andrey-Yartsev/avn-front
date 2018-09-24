import request from "@/utils/request";

export default {
  getPosts(data) {
    return request(`posts/feed?offset=${data.offset}&limit=${data.limit}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
  },
  getPostComments(data) {
    return request(`posts/${data.postId}/comments`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
  }
};
