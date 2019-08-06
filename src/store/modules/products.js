"use strict";

import { createRequestAction } from "../utils/storeRequest";

const fetchLimit = 20;

const initState = {
  allDataReceived: false,
  list: [],
  loading: false,
  offset: 0
};

const state = { ...initState };

const actions = {
  firstFetch({ commit, dispatch }) {
    commit("reset");
    return dispatch("fetch");
  },
  fetch({ commit, dispatch, state }) {
    commit("fetchStart");
    return dispatch("_fetch", state.offset).then(response => {
      commit("fetchComplete", response);
    });
  }
};

const mutations = {
  fetchStart(state) {
    state.loading = true;
  },
  fetchComplete(state) {
    state.list = [...state.list, ...state._fetchResult.list];
    if (state._fetchResult.list.length < fetchLimit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + fetchLimit;
    }
    state.loading = false;
  },
  reset(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  }
};

createRequestAction({
  prefix: "_fetch",
  apiPath: "users/paid/products",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {
      offset: 0,
      limit: fetchLimit
    }
  },
  paramsToOptions: function(params, options) {
    options.query.offset = params || 0;
    return options;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
