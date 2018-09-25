import tokenRequest from "@/utils/tokenRequest";
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
  },
  sendPostComment({ postId, text }) {
    return tokenRequest(`posts/${postId}/comments`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });
  }
};
