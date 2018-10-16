"use strict";

const state = {
  route: null,
  path: "",
  params: null,
  loading: false
};

const mutations = {
  updateRoute(state, route) {
    state.route = route;
  },
  updatePath(state, path) {
    state.path = path;
  },
  updateParams(state, params) {
    state.params = params;
  },
  updateLoading(state, loading) {
    state.loading = loading;
  }
};

const actions = {
  updatePath({ commit }, path = "") {
    window.location.hash = "m/" + path;
    commit("updatePath", path);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
