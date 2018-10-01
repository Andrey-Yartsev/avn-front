import tokenRequest from "@/utils/tokenRequest";

export default {
  getPosts({ offset, limit, marker }) {
    return tokenRequest(`posts/feed`, {
      method: "GET",
      query: {
        offset,
        limit,
        marker
      }
    });
  },
  getPostComments(data) {
    return tokenRequest(`posts/${data.postId}/comments`, {
      method: "GET"
    });
  },
  sendPostComment({ postId, text }) {
    return tokenRequest(`posts/${postId}/comments`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({ text })
    });
  },
  likePost({ postId, addLike }) {
    return tokenRequest(`posts/${postId}/favorites`, {
      method: addLike ? "POST" : "DELETE",
      mode: "cors"
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
