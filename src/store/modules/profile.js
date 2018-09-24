"use strict";

import AuthApi from "@/api/auth";

const state = {
  loading: false,
  error: null
};

const actions = {
  update({ commit, dispatch }, user) {
    commit("setError", null);
    commit("setLoading", true);
    AuthApi.update(user)
      .then(async response => {
        const r = await response.json();
        dispatch("auth/extendUser", r, { root: true });
        dispatch("global/flashToast", null, { root: true });
        commit("setLoading", false);
      })
      .catch(error => {
        commit("setError", error);
        commit("setLoading", false);
      });
  }
};

const mutations = {
  setError(state, error) {
    state.error = error;
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
