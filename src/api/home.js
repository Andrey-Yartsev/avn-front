import tokenRequest from "@/utils/tokenRequest";

export default {
  getPosts({ offset, limit, marker }) {
    return tokenRequest(`posts/feed`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      query: {
        offset,
        limit,
        marker
      }
    });
  },
  getPostComments(data) {
    return tokenRequest(`posts/${data.postId}/comments`, {
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
  },
  likePost({ postId, addLike }) {
    return tokenRequest(`posts/${postId}/favorites`, {
      method: addLike ? "POST" : "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  savePost(data) {
    return tokenRequest(`posts`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  }
};
