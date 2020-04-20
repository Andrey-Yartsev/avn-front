"use strict";

const state = {};

const mutations = {};

const actions = {
  commentRemove(
    { dispatch },
    { actionPrefix, postId, commentId, confirmBlockUser, author }
  ) {
    dispatch(
      "modal/show",
      {
        name: "confirm",
        data: {
          title: "Remove comment",
          success: () => {
            dispatch("commentRemoving", {
              actionPrefix,
              postId,
              commentId
            });
            if (confirmBlockUser && author && !author.isBlocked) {
              setTimeout(() => {
                dispatch(
                  "modal/show",
                  {
                    name: "confirm",
                    data: {
                      title: "Block user",
                      text: "Do you want to block this user?",
                      success: () => {
                        dispatch("user/block", author.id, { root: true });
                      }
                    }
                  },
                  { root: true }
                );
              }, 500);
            }
          }
        }
      },
      { root: true }
    );
  },
  commentRemoving({ dispatch }, { actionPrefix, postId, commentId }) {
    dispatch(
      actionPrefix + "/removeComment",
      {
        postId,
        commentId
      },
      { root: true }
    );
  },
  likePost({ dispatch }, { actionPrefix, post }) {
    dispatch(
      actionPrefix + "/likePost",
      {
        post,
        addLike: !post.isFavorite
      },
      { root: true }
    );
  },
  likeComment({ dispatch }, { actionPrefix, postId, commentId, addLike }) {
    dispatch(
      actionPrefix + "/likeComment",
      {
        postId: postId,
        commentId: commentId,
        addLike
      },
      { root: true }
    );
  },
  sendNewComment({ dispatch }, { actionPrefix, post, msg, commentReplyId }) {
    dispatch(
      actionPrefix + "/sendPostComment",
      {
        post,
        text: msg,
        answerTo: commentReplyId
      },
      { root: true }
    );
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
