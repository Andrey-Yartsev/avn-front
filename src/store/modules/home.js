"use strict";

// import BrowserStore from "store";
import HomeApi from "@/api/home";

const state = {
  loading: false,
  error: null,
  posts: []
};

const actions = {
  getPosts({ commit }, data) {
    commit("postsRequest");
    return HomeApi.getPosts(data)
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("postsRequestSuccess", res.list);
          });
        }
      })
      .catch(err => {
        commit("postsRequestFail", err);
      });
  }
};

const mutations = {
  ["postsRequestSuccess"](state, posts) {
    state.posts = posts.filter(post => {
      return (
        post.media.length > 0 &&
        post.media[0].type === "video" &&
        post.media[0].canView === true
      );
    });
    state.loading = false;
  },

  ["postsRequestFail"](state, err) {
    state.error = err;
    state.loading = false;
  },

  ["postsRequest"](state) {
    state.loading = true;
  }
  //   ["AUTH_SUCCESS"](state) {
  //     // state.user.email = email
  //     BrowserStore.set("user", state.tempUser);
  //   },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
