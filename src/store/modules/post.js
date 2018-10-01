"use strict";

// import BrowserStore from "store";
import HomeApi from "@/api/home";
import router from "@/router";

const state = {};
const mutations = {};

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
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
