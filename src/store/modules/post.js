"use strict";

// import BrowserStore from "store";
import HomeApi from "@/api/home";
import router from "@/router";

const state = {};
const mutations = {
  ["sendPostReportSuccess"](state, { postId, reasonId }) {
    state.reportedPost = { postId, reasonId };
  }
};

const actions = {
  savePost({ commit }, data) {
    return HomeApi.savePost(data)
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
    return HomeApi.sendPostReport({ postId, reasonId })
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
