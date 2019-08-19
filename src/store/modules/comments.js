"use strict";

const state = {};

const mutations = {};

const actions = {
  commentRemove({ dispatch }, { actionPrefix, postId, commentId }) {
    dispatch(
      "modal/show",
      {
        name: "confirm",
        data: {
          title: "Remove comment",
          success: () =>
            dispatch("commentRemoving", {
              actionPrefix,
              postId,
              commentId
            })
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
