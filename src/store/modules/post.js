"use strict";

// import BrowserStore from "store";
import PostApi from "@/api/post";
import router from "@/router";

const state = {
  currentPost: undefined,
  reportedPost: undefined,
  postReportReasons: []
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
  }
};

const actions = {
  savePost({ commit }, data) {
    return PostApi.savePost(data)
      .then(response => {
        if (response.status === 200) {
          router.go({
            path: "/",
            force: true
          });
        }
      })
      .catch(err => {
        commit("sendPostCommentFail", err);
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
