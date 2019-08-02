"use strict";

import { createRequestAction } from "../utils/storeRequest";

const initState = {
  list: [],
  loading: false
};

const state = { ...initState };

const actions = {
  fetch({ commit, dispatch }) {
    commit("fetchStart");
    return dispatch("_fetch").then(response => {
      commit("fetchComplete", response);
    });
  }
};

const mutations = {
  fetchStart(state) {
    state.loading = true;
  },
  fetchComplete(state) {
    state.list = state._fetchResult.list;
    state.loading = false;
  }
};

createRequestAction({
  prefix: "_fetch",
  apiPath: "users/paid/products",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
