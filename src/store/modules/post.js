"use strict";

import PostApi from "@/api/post";
import { createRequestAction } from "../utils/storeRequest";

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

  updatePostSuccess(state, data) {
    state.updatedPost = data;
  }
};

const actions = {
  async createPost({ dispatch, commit }, data) {
    await dispatch("_createPost", data);
    commit("modal/hide", { name: "addPost" }, { root: true });
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

createRequestAction({
  prefix: "_createPost",
  apiPath: "posts",
  resultKey: "newPost",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

createRequestAction({
  prefix: "updatePost",
  apiPath: "posts/{id}",
  resultKey: "newPost",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToOptions: function(params, options) {
    options.data = params.data;
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{id}/, params.postId);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
