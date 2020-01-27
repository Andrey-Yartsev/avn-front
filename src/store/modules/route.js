"use strict";

const state = {
  changinName: null,
  loadingName: null
};
const actions = {};
const mutations = {
  setChangingName(state, loadingName) {
    state.loadingName = loadingName;
  },
  setLoadingName(state, loadingName) {
    state.loadingName = loadingName;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
