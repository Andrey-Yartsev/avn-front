"use strict";

import { createRequestAction } from "../utils/storeRequest";

const state = {
  results: {
    list: [],
    marker: undefined,
    suggestions: []
  }
};

const actions = {};
const mutations = {
  reset(state) {
    state.results = {
      list: [],
      marker: undefined,
      suggestions: []
    };
  }
};

createRequestAction({
  prefix: "search",
  apiPath: "search/users",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultKey: "results",
  defaultResultValue: [],
  paramsToOptions: function(params, options) {
    if (!params.offset) {
      params.offset = 0;
    }
    if (!params.limit) {
      params.limit = 5;
    }
    options.query = params;
    return options;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
