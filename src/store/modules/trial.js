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

createRequestAction({
  prefix: "getModels",
  apiPath: "users/trials",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToOptions: function(params, options) {
    options.query = {};
    options.query.limit = 100;
    return options;
  },
  resultConvert: r => {
    return r.list;
  }
});

createRequestAction({
  prefix: "getModel",
  apiPath: "users/{code}/trial",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{code}/, params);
  },
  localError: true
});

createRequestAction({
  prefix: "getCode",
  apiPath: "users/trial/months",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  resultKey: "code",
  resultConvert: r => {
    return r.trialCode;
  },
  paramsToOptions: function(params, options) {
    options.data = params || {};
    return options;
  }
});

createRequestAction({
  prefix: "delete",
  apiPath: "users/{code}/trial",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{code}/, params.trialId);
  }
});

createRequestAction({
  prefix: "sendCodeStatus",
  apiPath: "users/trial",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  },
  throw400: true
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
