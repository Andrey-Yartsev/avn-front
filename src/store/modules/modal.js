"use strict";

const state = {
  postReport: {
    show: false,
    data: {}
  },
  post: {
    show: false,
    data: {}
  },
  messages: {
    show: false
  }
};

const mutations = {
  show(state, { name, data }) {
    state[name].show = true;
    state[name].data = data;
  },
  hide(state, { name }) {
    state[name].show = false;
    state[name].data = {};
  },
  hideAll(state) {
    for (let name in state) {
      state[name].show = false;
      state[name].data = {};
    }
  }
};

const actions = {
  show({ commit }, { name, data }) {
    commit("show", { name, data });
  },

  hide({ commit }, { name, data }) {
    commit("hide", { name, data });
  },

  hideAll({ commit }) {
    commit("hideAll");
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
