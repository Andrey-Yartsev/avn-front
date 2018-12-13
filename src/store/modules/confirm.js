"use strict";

const state = {
  yes: null
};

const mutations = {
  reset(state) {
    state.yes = null;
  },
  yes(state) {
    state.yes = true;
  },
  no(state) {
    state.yes = false;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
