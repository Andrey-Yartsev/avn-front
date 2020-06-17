"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};
const actions = {};
const mutations = {};

createRequestAction({
  prefix: "connect",
  apiPath: "users/social/google",
  state,
  mutations,
  actions,
  localError: true,
  throw400: true,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    // if (window.okev) {
    //   options.data.sentry = JSON.stringify(window.okev.all());
    // }
    return options;
  }
});

createRequestAction({
  prefix: "disconnect",
  apiPath: "users/social/google",
  state,
  mutations,
  actions,
  localError: true,
  throw400: true,
  options: {
    method: "DELETE"
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
