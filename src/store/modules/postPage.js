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
  marker: ""
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
    return PostApi.getPost({ postId })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("postsRequestSuccess", { list: [res] });
          });
        }
      })
      .catch(err => {
        commit("postsRequestFail", err);
      });
  }
};

export default {
  namespaced: true,
  state,
  actions: { ...actions, ...PostMixin.actions },
  mutations: { ...mutations, ...PostMixin.mutations }
};
