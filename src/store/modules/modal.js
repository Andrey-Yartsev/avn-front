"use strict";

const state = {
  postReport: false
};

const mutations = {
  ["show"](state, name) {
    state[name] = true;
  },
  ["hide"](state, name) {
    state[name] = false;
  }
};

const actions = {
  show({ commit }, name) {
    commit("show", name);
  },

  hide({ commit }, name) {
    commit("hide", name);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
