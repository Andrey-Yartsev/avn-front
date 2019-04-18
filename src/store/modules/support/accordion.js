"use strict";

const state = {
  opened: {
    0: 0,
    1: 0,
    2: 0,
    3: 0
  }
};

const mutations = {
  open(state, { level, id }) {
    state.opened[level] = id;
  },
  closeAll(state, { level }) {
    state.opened[level] = 0;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
