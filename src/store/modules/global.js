"use strict";

import BrowserStore from "store";

const darkTheme = !!BrowserStore.get("darkTheme");

const state = {
  toastShowTrigger: false,
  toastText: "",
  error: null,
  darkTheme
};

const actions = {
  flashToast({ commit }, text) {
    commit("toastShowTrigger", text);
  },

  setError({ commit }, error) {
    commit("setError", error);
  },

  toggleDarkTheme({ dispatch, state }) {
    dispatch("setDarkTheme", !state.darkTheme);
  },

  setDarkTheme({ commit }, darkTheme) {
    commit("setDarkTheme", darkTheme);
    BrowserStore.set("darkTheme", darkTheme);
  }
};

const mutations = {
  toastShowTrigger(state, text) {
    state.toastShowTrigger = !state.toastShowTrigger;
    state.toastText = text;
  },

  setError(state, error) {
    state.error = error;
  },

  setDarkTheme(state, darkTheme) {
    state.darkTheme = darkTheme;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
