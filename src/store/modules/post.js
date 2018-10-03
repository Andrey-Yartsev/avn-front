"use strict";

// import BrowserStore from "store";
import PostApi from "@/api/post";
import router from "@/router";

const state = {
  currentPost: undefined,
  reportedPost: undefined
};
const mutations = {
  ["sendPostReportSuccess"](state, { postId, reasonId }) {
    state.reportedPost = { postId, reasonId };
  },

  ["setCurrentPost"](state, { postData }) {
    state.currentPost = postData;
  }
};

const actions = {
  getPost({ commit }, { postId }) {
    return PostApi.getPost({ postId })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(postData) {
            commit("setCurrentPost", {
              postData
            });
          });
        }
      })
      .catch(() => {});
  },
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
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
