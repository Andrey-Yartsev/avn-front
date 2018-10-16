"use strict";

import { createRequestAction } from "../utils/storeRequest";

const state = {};

const mutations = {};

const actions = {};

createRequestAction({
  prefix: "fetch",
  apiPath: "users/notifications",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {
      offset: 0,
      limit: 10
    }
  },
  resultKey: "items",
  defaultResultValue: [],
  paramsToOptions: function(params, options) {
    options.query.type = params;
    return options;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
