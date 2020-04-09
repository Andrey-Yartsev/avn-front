"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};
const actions = {};
const mutations = {};

createRequestAction({
  prefix: "fetch",
  apiPath: "payouts/requests",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "withdraw",
  apiPath: "payouts/requests",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  localError: true,
  throw400: true,
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
