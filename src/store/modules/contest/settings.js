"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const fetchLimit = 10;

const state = {
  supporters: [],
  offset: 0,
  limit: fetchLimit,
  allSupportersReceived: false
};

const mutations = {
  setSupporters(state, list) {
    state.supporters = [...state.supporters, ...list];
  },
  resetSupporters(state) {
    state.supporters = [];
    state.offset = 0;
    state.allSupportersReceived = false;
  },
  isAllSupportersReceived(state, length) {
    if (length < state.limit) {
      state.allSupportersReceived = true;
    } else {
      state.offset = state.offset + state.limit;
    }
  }
};

const actions = {
  getSupporters({ dispatch, commit }, { contestId }) {
    return dispatch("_getSupporters", {
      limit: state.limit,
      offset: state.offset,
      contestId
    }).then(res => {
      commit("setSupporters", res);
      commit("isAllSupportersReceived", res.length);
      return res;
    });
  }
};

createRequestAction({
  prefix: "fetch",
  requestType: "token",
  apiPath: "contests/me",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "_getSupporters",
  requestType: "token",
  apiPath: "contests/me/{contestId}/supporters",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToOptions: function(params) {
    const options = {
      method: "GET",
      query: {}
    };
    options.query.offset = params.offset || 0;
    options.query.limit = fetchLimit;
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{contestId}/, params.contestId);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
