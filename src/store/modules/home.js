"use strict";

import PostApi from "@/api/post";
import PostComments from "../mixins/posts";

const state = {
  loading: false,
  error: null,
  posts: [],
  allDataReceived: false,
  limit: 10,
  offset: 0,
  marker: "",
  postReportReasons: []
};

const mutations = {
  ["resetPageState"]() {
    state.loading = false;
    state.error = null;
    state.posts = [];
    state.allDataReceived = false;
    state.limit = 10;
    state.offset = 0;
    state.marker = "";
    state.postReportReasons = [];
  },

  ["postsRequestSuccess"](state, { list: posts, marker }) {
    state.posts = [...state.posts, ...posts];

    if (posts.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + state.limit;
    }
    state.loading = false;
    state.marker = state.marker.length ? state.marker : marker;
  },

  ["postsRequestFail"](state, err) {
    state.error = err;
    state.loading = false;
  },

  ["postsRequest"](state) {
    state.loading = true;
  },

  ["getPostReportReasonsSuccess"](state, data) {
    state.postReportReasons = data;
  }
};

const actions = {
  resetPage({ commit }) {
    commit("resetPageState");
  },

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
