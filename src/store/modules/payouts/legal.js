"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};
const actions = {};
const mutations = {
  updateData(state, { key, value }) {
    state.fetchResult = {
      ...state.fetchResult,
      [key]: value
    };
  }
};

createRequestAction({
  prefix: "fetch",
  apiPath: "payouts/legal",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "save",
  apiPath: "payouts/legal",
  state,
  mutations,
  actions,
  resultKey: "fetchResult",
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params.data;
    if (window.okev) {
      options.data.sentry = JSON.stringify(window.okev.all());
    }
    if (params.update) {
      options.query = {
        update: true
      };
    }
    return options;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
