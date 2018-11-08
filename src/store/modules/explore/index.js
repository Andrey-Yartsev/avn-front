"use strict";

import PostMixin from "@/store/mixins/posts";

const initState = {
  loading: false,
  error: null,
  posts: [],
  allDataReceived: false,
  limit: 12,
  offset: 0,
  marker: "",
  source: "media",
  deletedPost: undefined
};

const state = { ...initState };

const mutations = {
  resetPageState(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  },
  setSource(state, { source }) {
    state.source = source;
  }
};

const actions = {
  setSource({ commit }, { source }) {
    commit("setSource", { source });
  }
};

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
