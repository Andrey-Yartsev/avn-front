import anyRequest from "@/utils/anyRequest";
import tokenRequest from "@/utils/tokenRequest";

export default {
  getPosts({ offset, limit, marker, source }) {
    return anyRequest(`stories/${source}`, {
      method: "GET",
      query: {
        offset,
        limit,
        marker
      }
    });
  },
  getUserStory({ userId }) {
    return anyRequest(`users/${userId}/stories/`, {
      method: "GET"
    });
  },
  watchStory({ postId }) {
    return tokenRequest(`stories/${postId}/watched`, {
      method: "PUT"
    });
  },
  savePost(data) {
    return tokenRequest(`stories`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  },
  deletePost({ postId }) {
    return tokenRequest(`stories/${postId}`, {
      method: "DELETE",
      mode: "cors"
    });
  }
};
