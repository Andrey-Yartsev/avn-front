"use strict";

import PostApi from "@/api/post";

const state = {
  currentPost: undefined,
  reportedPost: undefined,
  postReportReasons: [],
  newPost: undefined,
  updatedPost: undefined
};
const mutations = {
  sendPostReportSuccess(state, { postId, reasonId }) {
    state.reportedPost = { postId, reasonId };
  },

  setCurrentPost(state, { postData }) {
    state.currentPost = postData;
  },

  getPostReportReasonsSuccess(state, data) {
    state.postReportReasons = data;
  },

  savePostSuccess(state, data) {
    state.newPost = data;
  },

  updatePostSuccess(state, data) {
    state.updatedPost = data;
  }
};

const actions = {
  savePost({ commit }, data) {
    return PostApi.savePost(data)
      .then(async response => {
        if (response.status === 200) {
          const newPost = await response.json();
          commit("savePostSuccess", newPost);
          commit("modal/hide", { name: "addPost" }, { root: true });
        }
      })
      .catch(err => {
        commit("sendPostCommentFail", err);
      });
  },

  updatePostData({ commit }, { postId, data }) {
    return PostApi.updatePost({ postId, data })
      .then(async response => {
        if (response.status === 200) {
          const newPost = await response.json();
          commit("savePostSuccess", newPost);
        }
      })
      .catch(err => {
        commit("sendPostCommentFail", err);
      });
  },

  updatePost({ commit }, { postId }) {
    return PostApi.getPost({ postId })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(post) {
            commit("updatePostSuccess", post);
          });
        }
      })
      .catch(err => {
        commit("postsRequestFail", err);
      });
  },

  sendReport({ commit }, { postId, reasonId }) {
    return PostApi.sendPostReport({ postId, reasonId })
      .then(response => {
        if (response.status === 200) {
          commit("sendPostReportSuccess", { postId, reasonId });
        }
      })
      .catch(() => {});
  },

  getPostReportReasons({ commit }, { type }) {
    return PostApi.getPostReportReasons({ type })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("getPostReportReasonsSuccess", res);
          });
        }
      })
      .catch(() => {});
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
