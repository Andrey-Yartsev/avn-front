"use strict";

import PostApi from "@/api/post";
import PostComments from "../mixins/posts";

const initState = {
  loading: false,
  error: null,
  posts: [],
  allDataReceived: false,
  limit: 10,
  offset: 0,
  marker: "",
  postReportReasons: []
};

const state = { ...initState };

const mutations = {
  getPostReportReasonsSuccess(state, data) {
    state.postReportReasons = data;
  },
  resetPageState(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  }
};

const actions = {
  getPosts({ commit }) {
    const { limit, offset, marker } = state;
    commit("postsRequest");

    return PostApi.getPosts({ limit, offset, marker })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("postsRequestSuccess", res);
          });
        }
      })
      .catch(err => {
        commit("postsRequestFail", err);
      });
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
  actions: { ...actions, ...PostComments.actions },
  mutations: { ...mutations, ...PostComments.mutations }
};
