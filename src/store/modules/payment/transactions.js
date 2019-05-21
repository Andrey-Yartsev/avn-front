"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const initState = {
  allDataReceived: false,
  list: [],
  offset: 0,
  loading: false,
  marker: ""
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

const fetchLimit = 15;

const mutations = {
  fetchStart(state) {
    state.loading = true;
  },
  fetchComplete(state, { marker }) {
    state.list = [...state.list, ...state._fetchResult.list];
    if (state._fetchResult.list.length < fetchLimit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + fetchLimit;
    }
    state.loading = false;
    state.marker = state.marker ? state.marker : marker;
  },
  reset(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  }
};

createRequestAction({
  prefix: "_fetch",
  apiPath: "payments/transactions",
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
