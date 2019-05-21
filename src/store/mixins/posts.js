import PostApi from "@/api/post";
import ws from "@/ws";

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

    getPostComments({ commit }, { postId, page, marker }) {
      commit("postCommentsRequest", { postId });
      return PostApi.getPostComments({ postId, page, marker })
        .then(response => {
          if (response.status === 200) {
            response.json().then(function({ list, marker }) {
              commit("postCommentsRequestSuccess", {
                postId,
                marker,
                list,
                page
              });
            });
          }
        })
        .catch(err => {
          commit("commentsRequestFail", err);
        });
    },

    sendPostComment({ commit }, { post, text, answerTo }) {
      const postId = post.id;
      return PostApi.sendPostComment({ postId, text, answerTo })
        .then(response => {
          if (response.status === 200) {
            response.json().then(function(comment) {
              commit("postSendCommentsRequestSuccess", {
                postId,
                comment
              });

              ws.send({
                act: "collect",
                message: "comment_added",
                data: {
                  post_id: postId,
                  post_user_id: comment.author.id,
                  comment_id: comment.id,
                  owner: post.author.id
                }
              });
            });
          }
        })
        .catch(err => {
          commit("sendPostCommentFail", err);
        });
    },

    likePost({ commit }, { post, addLike }) {
      const postId = post.id;
      return PostApi.likePost({ postId, addLike })
        .then(response => {
          if (response.status === 200) {
            response.json().then(function(r) {
              const { isFavorite, favoritesCount } = r;
              commit("postLikeSuccess", {
                postId,
                isFavorite,
                favoritesCount
              });

              ws.send({
                act: "collect",
                message: addLike ? "post_like" : "post_unlike",
                data: {
                  post_id: post.id,
                  post_user_id: post.author.id,
                  weight: addLike ? 1 : -1,
                  owner: post.author.id
                }
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
    },

    removeComment({ commit }, { postId, commentId }) {
      return PostApi.removeComment({ commentId })
        .then(response => {
          if (response.status === 200) {
            response.json().then(() => {
              commit("postCommentRemoveSuccess", {
                postId,
                commentId
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
      state.marker = state.marker ? state.marker : marker;
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
            commentsLoading: true
          };
        }

        return post;
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
          fullComments: [data.comment, ...(post.fullComments || [])],
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
            fullComments: (post.fullComments || []).map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  isLiked,
                  likesCount
                };
              }
              return comment;
            }),
            comments: (post.comments || []).map(comment => {
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

    postCommentRemoveSuccess(state, { postId, commentId }) {
      state.posts = state.posts.map(post => {
        if (postId === post.id) {
          return {
            ...post,
            fullComments: (post.fullComments || []).filter(
              c => c.id !== commentId
            ),
            comments: (post.comments || []).filter(c => c.id !== commentId),
            commentsCount: post.commentsCount - 1
          };
        }
        return post;
      });
    },

    deletePost(state, { postId }) {
      state.deletedPost = postId;
      state.posts = state.posts.filter(post => postId !== post.id);
    },

    resetComments(state, { postId }) {
      state.posts = state.posts.map(post => {
        if (postId === post.id) {
          return {
            ...post,
            fullComments: [],
            commentMarker: undefined
          };
        }

        return post;
      });
    },

    postCommentsRequestSuccess(state, { postId, list, page, marker }) {
      state.posts = state.posts.map(post => {
        if (postId !== post.id) {
          return post;
        }

        return {
          ...post,
          fullComments: [...(post.fullComments || []), ...list],
          comments: page === 1 ? list : post.comments,
          commentsLoading: false,
          commentMarker: marker
        };
      });
    }
  }
};
