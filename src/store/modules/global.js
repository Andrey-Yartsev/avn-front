"use strict";

import BrowserStore from "store";

const darkTheme = !!BrowserStore.get("darkTheme");

const state = {
  toastShowTrigger: false,
  toastText: "",
  error: null,
  darkTheme,
  showUserMobileBar: false,
  userMobileBarOpening: false,
  scrollBarInitWidth: 0,
  scrollBarWidth: 0,
  modalOpened: false,
  openedModalsCount: 0,
  loading: false
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
  },

  openUserMobileBar({ commit }) {
    commit("setUserMobileBarOpening", true);
    setTimeout(() => {
      commit("setUserMobileBarOpening", false);
    }, 100);
    commit("showUserMobileBar", true);
  },

  hideUserMobileBar({ commit, state }) {
    if (state.userMobileBarOpening) {
      return;
    }
    commit("showUserMobileBar", false);
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
  },

  showUserMobileBar(state, show) {
    state.showUserMobileBar = show;
  },

  setUserMobileBarOpening(state, opening) {
    state.userMobileBarOpening = opening;
  },

  setScrollBarWidth(state, width) {
    state.scrollBarWidth = width;
  },

  setScrollBarInitWidth(state, width) {
    state.scrollBarInitWidth = width;
  },

  setModalOpened(state, opened) {
    state.modalOpened = opened;
    if (opened) {
      state.openedModalsCount++;
    } else {
      state.openedModalsCount--;
    }
  },

  setLoading(state, loading) {
    state.loading = loading;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
