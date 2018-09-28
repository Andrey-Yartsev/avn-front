"use strict";

const state = {
  toastShowTrigger: false,
  toastText: ""
};

const actions = {
  flashToast({ commit }, text) {
    commit("toastShowTrigger", text);
  }
};

const mutations = {
  toastShowTrigger(state, text) {
    state.toastShowTrigger = state.toastShowTrigger ? false : true;
    state.toastText = text;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
