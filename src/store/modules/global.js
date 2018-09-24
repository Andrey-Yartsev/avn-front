"use strict";

const state = {
  toastShowTrigger: false
};

const actions = {
  flashToast({ commit }) {
    commit("toastShowTrigger");
  }
};

const mutations = {
  toastShowTrigger(state) {
    state.toastShowTrigger = state.toastShowTrigger ? false : true;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
