import tokenRequest from "@/utils/tokenRequest";
import anyRequest from "@/utils/anyRequest";

export default {
  getPosts({ offset, limit, marker, source }) {
    return tokenRequest(`posts/${source}`, {
      method: "GET",
      query: {
        offset,
        limit,
        marker
      }
    });
  },
  getPost({ postId }) {
    return anyRequest(`posts/${postId}`, {
      method: "GET"
    });
  },
  getPostComments({ postId, page, marker }) {
    const limit = 5;
    const offset = (page - 1) * limit;

    return tokenRequest(
      `posts/${postId}/comments?limit=${limit}&offset=${offset}&marker=${marker}`,
      {
        method: "GET"
      }
    );
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
  likeComment({ commentId, addLike }) {
    return tokenRequest(`comments/${commentId}/like`, {
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
  },
  deletePost({ postId }) {
    return tokenRequest(`posts/${postId}`, {
      method: "DELETE",
      mode: "cors"
    });
  },
  getPostReportReasons({ type }) {
    return tokenRequest(`reports/reasons&type=${type}`, {
      method: "GET"
    });
  },
  sendPostReport({ postId, reasonId }) {
    return tokenRequest(`posts/${postId}/report`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reasonId
      })
    });
  }
};
