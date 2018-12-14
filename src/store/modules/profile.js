"use strict";

import UserApi from "@/api/user";
import home from "./profile/home.js";

const state = {
  loading: false,
  error: null,
  fetchLoading: true,
  fetchError: true,
  changed: false,
  changeTrigger: false
};

const actions = {
  fetch({ commit, dispatch }, options) {
    return new Promise((resolve, reject) => {
      if (!options) options = {};
      commit("setFetchLoading", true);
      UserApi.fetch().then(async response => {
        response = await response.json();
        commit("setFetchLoading", false);
        if (response.error) {
          if (response.error.code === 102) {
            dispatch("auth/setOtpAuth", true, { root: true });
          }
          commit("setFetchError", response.error);
          reject(response.error);
          return;
        }
        dispatch("auth/setUser", response, { root: true });
        resolve();
      });
    });
  },
  update({ commit, dispatch }, user) {
    commit("setError", null);
    commit("setLoading", true);
    return new Promise((accept, reject) => {
      UserApi.update(user)
        .then(async response => {
          const r = await response.json();
          dispatch("auth/extendUser", r, { root: true });
          dispatch("profile/home/extend", r, { root: true });
          dispatch("global/flashToast", "Changes saved successfully", {
            root: true
          });
          commit("setLoading", false);
          accept(r);
        })
        .catch(error => {
          dispatch("global/setError", error, { root: true });
          commit("setError", error);
          commit("setLoading", false);
          reject(error);
        });
    });
  },
  extend({ rootState, dispatch }, data) {
    return dispatch("update", { ...rootState.auth.user, ...data });
  },
  setFetchLoading({ commit }, flag) {
    commit("setFetchLoading", flag);
  }
};

const mutations = {
  setError(state, error) {
    state.error = error;
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  setFetchLoading(state, loading) {
    state.fetchLoading = loading;
  },
  setFetchError(state, error) {
    state.fetchError = error;
  },
  setChanged(state, changed) {
    state.changed = changed;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  modules: {
    home
  }
};
