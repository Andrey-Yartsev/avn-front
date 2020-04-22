"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const limit = 9;

const initState = {
  list: [],
  marker: null,
  offset: 0,
  allDataReceived: false,
  limit
};

const state = { ...initState };

const mutations = {
  reset(state) {
    for (let [k, v] of Object.entries(initState)) {
      state[k] = v;
    }
  },
  infinityScrollResult(state, items) {
    if (items.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + state.limit;
    }
  }
};

const actions = {
  fetch({ dispatch, commit, state }, params) {
    params.offset = state.offset;
    params.marker = state.marker || "";
    params.limit = state.limit;
    return dispatch("_fetch", params).then(r => {
      commit("infinityScrollResult", r.list);
    });
  }
};

createRequestAction({
  prefix: "_fetch",
  requestType: "token",
  apiPath: "chats/{userId}/messages",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultKey: "list",
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params.userId);
  },
  paramsToOptions: function(params, options) {
    options.query = {
      type: params.type,
      offset: params.offset || 0,
      limit: params.limit || limit,
      marker: params.marker || ""
    };
    return options;
  },
  resultConvert: function(result, state) {
    return [...state.list, ...result.list];
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
