"use strict";

import { createRequestAction } from "../utils/storeRequest";

const state = {};
const actions = {};
const mutations = {
  reset(state) {
    for (let k of Object.keys(state)) {
      state[k] = undefined;
    }
  }
};

createRequestAction({
  prefix: "fetch",
  apiPath: "users/products",
  state,
  mutations,
  actions,
  paramsToOptions: function(params, options) {
    options.query = params;
    return options;
  },
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "save",
  apiPath: "users/product",
  state,
  mutations,
  actions,
  paramsToOptions: function(params, options) {
    options.data = params.data;
    return options;
  },
  options: {
    method: "POST"
  }
});

createRequestAction({
  prefix: "update",
  apiPath: "users/product/{id}",
  state,
  mutations,
  actions,
  paramsToOptions: function(params, options) {
    options.data = params.data;
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{id}/, params.id);
  },
  options: {
    method: "PUT"
  }
});

createRequestAction({
  prefix: "activate",
  apiPath: "users/products/{id}/completed",
  state,
  mutations,
  actions,
  paramsToOptions: function(params, options) {
    options.data = params.data;
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{id}/, params.id);
  },
  options: {
    method: "PUT"
  }
});

createRequestAction({
  prefix: "delete",
  apiPath: "users/product/{id}",
  state,
  mutations,
  actions,
  resultKey: "messages",
  paramsToPath: function(params, path) {
    return path.replace(/{id}/, params.id);
  },
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
