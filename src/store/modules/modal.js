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
  },
  userReport: {
    show: false,
    data: {}
  },
  subscribe: {
    show: false,
    data: {}
  },
  payment: {
    show: false,
    data: {}
  },
  createStory: {
    show: false,
    data: {}
  },
  addPost: {
    show: false,
    data: {}
  },
  iframe: {
    show: false,
    data: {}
  },
  stream: {
    show: false,
    data: {}
  },
  subscriptionConfirm: {
    show: false,
    data: {}
  },
  login: {
    show: false,
    data: {}
  },
  signup: {
    show: false,
    data: {}
  },
  statPosts: {
    show: false,
    data: {}
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
  hideSafe(state, { name }) {
    state[name].show = false;
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

  hide({ commit }, { name }) {
    commit("hide", { name });
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
