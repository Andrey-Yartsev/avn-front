"use strict";

import PostApi from "@/api/post";
import PostMixin from "@/store/mixins/posts";

const initState = {
  loading: false,
  error: null,
  posts: [],
  allDataReceived: false,
  limit: 10,
  offset: 0,
  marker: "",
  deletedPost: undefined
};

const state = { ...initState };

const mutations = {
  resetPageState(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  }
};

const actions = {
  getPost({ commit }, { postId }) {
    commit("postsRequest");
    return new Promise((accept, reject) => {
      PostApi.getPost({ postId })
        .then(response => {
          if (response.status === 200) {
            response.json().then(function(res) {
              commit("postsRequestSuccess", { list: [res] });
              accept(res);
            });
          } else {
            reject({ message: "Not found" });
          }
        })
        .catch(err => {
          commit("postsRequestFail", err);
          reject(err);
        });
    });
  }
};

export default {
  namespaced: true,
  state: { ...state, ...PostMixin.state },
  actions: { ...actions, ...PostMixin.actions },
  mutations: { ...mutations, ...PostMixin.mutations }
};
