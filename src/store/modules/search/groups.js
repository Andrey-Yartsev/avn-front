"use strict";

import { createRequestAction } from "../../utils/storeRequest";

const state = {
  results: {
    list: [],
    marker: undefined,
    suggestions: []
  }
};

const mutations = {
  reset(state) {
    state.results = {
      list: [],
      marker: undefined,
      suggestions: []
    };
  },
  setItems(state, results) {
    state.results = results;
  }
};

const actions = {};

createRequestAction({
  requestType: "any",
  prefix: "search",
  apiPath: "groups/{userId}/search",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
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
  },
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params.userId);
  }
  // ,
  // resultConvert: function(result) {
  //   return result;
  // }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
