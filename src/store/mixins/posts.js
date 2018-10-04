import PostApi from "@/api/post";

export default {
  actions: {
    getPostComments({ commit }, { postId }) {
      commit("postCommentsRequest", { postId });
      return PostApi.getPostComments({ postId })
        .then(response => {
          if (response.status === 200) {
            response.json().then(function(list) {
              commit("postCommentsRequestSuccess", {
                postId,
                list
              });
            });
          }
        })
        .catch(err => {
          commit("commentsRequestFail", err);
        });
    },

    sendPostComment({ commit }, { postId, text }) {
      return PostApi.sendPostComment({ postId, text })
        .then(response => {
          if (response.status === 200) {
            response.json().then(function(comment) {
              commit("postSendCommentsRequestSuccess", {
                postId,
                comment
              });
            });
          }
        })
        .catch(err => {
          commit("sendPostCommentFail", err);
        });
    },

    likePost({ commit }, { postId, addLike }) {
      return PostApi.likePost({ postId, addLike })
        .then(response => {
          if (response.status === 200) {
            response.json().then(function({ isFavorite, favoritesCount }) {
              commit("postLikeSuccess", {
                postId,
                isFavorite,
                favoritesCount
              });
            });
          }
        })
        .catch(() => {});
    },

    deletePost({ commit }, { postId }) {
      return PostApi.deletePost({ postId })
        .then(response => {
          if (response.status === 200) {
            commit("deletePost", {
              postId
            });
          }
        })
        .catch(() => {});
    }
  },

  mutations: {
    postCommentsRequest(state, { postId }) {
      state.posts = state.posts.map(post => {
        if (postId === post.id) {
          return {
            ...post,
            comments: post.comments || [],
            commentsLoading: true,
            shownCommentsCount: 10
          };
        }

        return post;
      });
    },

    postCommentsRequestSuccess(state, data) {
      state.posts = state.posts.map(post => {
        if (data.postId !== post.id) {
          return post;
        }

        return {
          ...post,
          comments: [...post.comments, ...data.list],
          commentsLoading: false
        };
      });
    },

    postSendCommentsRequestSuccess(state, data) {
      state.posts = state.posts.map(post => {
        if (data.postId !== post.id) {
          return post;
        }

        return {
          ...post,
          comments: [data.comment, ...post.comments],
          shownCommentsCount: post.shownCommentsCount + 1
        };
      });
    },

    commentsRequestFail(/* state, err */) {
      // TODO;
    },

    postLikeSuccess(state, { postId, isFavorite, favoritesCount }) {
      state.posts = state.posts.map(post => {
        if (postId === post.id) {
          return {
            ...post,
            isFavorite,
            favoritesCount
          };
        }

        return post;
      });
    },

    deletePost(state, data) {
      state.posts = state.posts.filter(post => data.postId !== post.id);
    }
  }
};
