"use strict";

const state = {
  path: "",
  params: null
};

const mutations = {
  updatePath(state, path) {
    state.path = path;
  },
  updateParams(state, params) {
    state.params = params;
  }
};

const actions = {
  updatePath({ commit }, path = "") {
    window.location.hash = path;
    commit("updatePath", path);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
