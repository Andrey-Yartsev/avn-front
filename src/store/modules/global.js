"use strict";

const state = {
  toastShowTrigger: false,
  toastText: "",
  error: null
};

const actions = {
  flashToast({ commit }, text) {
    commit("toastShowTrigger", text);
  },

  setError({ commit }, error) {
    commit("setError", error);
  }
};

const mutations = {
  toastShowTrigger(state, text) {
    state.toastShowTrigger = state.toastShowTrigger ? false : true;
    state.toastText = text;
  },

  setError(state, error) {
    state.error = error;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
