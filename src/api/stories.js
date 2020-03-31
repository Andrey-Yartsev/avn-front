import anyRequest from "@/utils/anyRequest";
import tokenRequest from "@/utils/tokenRequest";

export default {
  getPosts({ offset, limit, marker, source, category }) {
    if (!category) {
      category = 1;
    }

    return anyRequest(`stories/${source}`, {
      method: "GET",
      query: {
        offset,
        limit,
        marker,
        category
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
  redirectStory({ postId }) {
    return tokenRequest(`stories/${postId}/link/visited`, {
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
  saveCollection(data) {
    const { id, title, storyIds, coverStoryId } = data;
    return tokenRequest(`stories/collections/${id || ""}`, {
      method: id ? "PUT" : "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        storyIds,
        coverStoryId
      })
    });
  },
  deletePost({ postId }) {
    return tokenRequest(`stories/${postId}`, {
      method: "DELETE",
      mode: "cors"
    });
  }
};
