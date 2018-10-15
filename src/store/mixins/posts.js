import PostApi from "@/api/post";

export default {
  actions: {
    getPosts({ commit, state }) {
      const { limit, offset, marker, source } = state;
      commit("postsRequest");

      return PostApi.getPosts({ limit, offset, marker, source })
        .then(response => {
          if (response.status === 200) {
            response.json().then(function(res) {
              commit("postsRequestSuccess", res);
            });
          }
        })
        .catch(err => {
          commit("postsRequestFail", err);
        });
    },

    resetPageState({ commit }) {
      commit("resetPageState");
    },

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
    },

    likeComment({ commit }, { postId, commentId, addLike }) {
      return PostApi.likeComment({ commentId, addLike })
        .then(response => {
          if (response.status === 200) {
            response.json().then(function({ isLiked, likesCount }) {
              commit("postCommentLikeSuccess", {
                postId,
                commentId,
                isLiked,
                likesCount
              });
            });
          }
        })
        .catch(() => {});
    }
  },

  mutations: {
    postsRequestSuccess(state, { list: posts, marker }) {
      state.posts = [...state.posts, ...posts];

      if (posts.length < state.limit) {
        state.allDataReceived = true;
      } else {
        state.offset = state.offset + state.limit;
      }
      state.loading = false;
      state.marker = state.marker.length ? state.marker : marker;
    },

    postsRequestFail(state, err) {
      state.error = err;
      state.loading = false;
    },

    postsRequest(state) {
      state.loading = true;
    },

    postCommentsRequest(state, { postId }) {
      state.posts = state.posts.map(post => {
        if (postId === post.id) {
          return {
            ...post,
            comments: [],
            commentsLoading: true,
            shownCommentsCount: 3,
            shownCommentsCountFull: 10
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
          comments: [data.comment, ...(post.comments || [])],
          shownCommentsCount: (post.shownCommentsCount || 0) + 1,
          shownCommentsCountFull: (post.shownCommentsCountFull || 0) + 1,
          commentsCount: post.commentsCount + 1
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

    postCommentLikeSuccess(state, { postId, commentId, isLiked, likesCount }) {
      state.posts = state.posts.map(post => {
        if (postId === post.id) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  isLiked,
                  likesCount
                };
              }
              return comment;
            })
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
