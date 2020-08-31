import PostApi from "@/api/post";
import { createRequestAction } from "@/store/utils/storeRequest";

const result = {
  state: {},
  actions: {
    getPosts({ commit, state, rootState }) {
      const { limit, offset, marker, source, tag } = state;
      commit("postsRequest");

      const category = rootState.gender.category;

      return PostApi.getPosts({ limit, offset, marker, source, category, tag })
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
    },
    reloadPost({ dispatch, commit }, postId) {
      dispatch("fetchPost", postId).then(data => {
        commit("updatePost", data);
      });
    },
    updatePost(state, updatedPost) {
      const find = () => {
        state.posts.find(post => post.id === updatedPost.id);
      };
      const update = () => {
        state.posts = state.posts.map(post => {
          if (post.id === updatedPost.id) {
            return updatedPost;
          }
          return post;
        });
      };
      if (!find()) {
        setTimeout(() => {
          if (find()) {
            update();
          } else {
            if (find()) {
              update();
            } else {
              setTimeout(() => {
                update();
              }, 2000);
            }
          }
        }, 1000);
      } else {
        update();
      }
    }
  },
  mutations: {
    postsRequestSuccess(state, { list: posts, marker }) {
      posts = posts.map(v => {
        const r = { ...v };
        r.isVisible = true;
        return r;
      });

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
    updateVisibility(state, items) {
      const posts = [...state.posts];
      items.forEach(item => {
        posts[item.index].isVisible = item.isVisible;
      });
      state.posts = posts;
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
    commentsRequestFail(/* state, err */) {},
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
      state.deletedPost = state.posts.find(post => post.id === postId);
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
    },
    updatePost(state, updatedPost) {
      state.posts = state.posts.map(post => {
        if (post.id === updatedPost.id) {
          return updatedPost;
        }

        return post;
      });
    }
  }
};

createRequestAction({
  prefix: "fetchPost",
  apiPath: "posts/{id}",
  state: result.state,
  mutations: result.mutations,
  actions: result.actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{id}/, params);
  }
});

export default result;
