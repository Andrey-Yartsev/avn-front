"use strict";

import { createRequestAction } from "../../utils/storeRequest";

const state = {
  summary: {}
};

const mutations = {
  reset(state) {
    state.summary = {};
  }
};

const actions = {};

createRequestAction({
  requestType: "any",
  prefix: "search",
  apiPath: "search",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultKey: "summary",
  defaultResultValue: [],
  paramsToOptions: function(params, options) {
    options.query = params;
    return options;
  },
  resultConvert: function(result) {
    return result.summary;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
