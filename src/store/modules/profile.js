"use strict";

import UserApi from "@/api/user";

const state = {
  loading: false,
  error: null,
  fetchLoading: true,
  fetchError: true
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
    UserApi.update(user)
      .then(async response => {
        const r = await response.json();
        dispatch("auth/extendUser", r, { root: true });
        dispatch("global/flashToast", "Changes saved successfully", {
          root: true
        });
        commit("setLoading", false);
      })
      .catch(error => {
        commit("setError", error);
        commit("setLoading", false);
      });
  },
  extend({ rootState, dispatch }, data) {
    dispatch("update", Object.assign({}, rootState.auth.user, data));
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
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
