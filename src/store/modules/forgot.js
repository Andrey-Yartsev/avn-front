"use strict";

import { createRequestAction } from "../utils/storeRequest";

const state = {};

const mutations = {};

const actions = {};

createRequestAction({
  requestType: "no-token",
  prefix: "send",
  apiPath: "users/forgot-password",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  },
  localError: true
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
