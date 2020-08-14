"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};
const actions = {};
const mutations = {
  updateData(state, { key, value }) {
    state = {
      ...state,
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
    options.data = params;
    if (window.okev) {
      options.data.sentry = JSON.stringify(window.okev.all());
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
