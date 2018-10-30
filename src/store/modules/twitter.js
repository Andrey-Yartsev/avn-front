"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};
const actions = {};
const mutations = {};

createRequestAction({
  prefix: "connect",
  apiPath: "users/social/twitter",
  state,
  mutations,
  actions,
  localError: true,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

createRequestAction({
  prefix: "disconnect",
  apiPath: "users/social/twitter",
  state,
  mutations,
  actions,
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
