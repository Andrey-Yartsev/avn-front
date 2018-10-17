"use strict";

import { createRequestAction } from "../../utils/storeRequest";

const state = {};

const mutations = {
  reset(state) {
    state.items = [];
  }
};

const actions = {};

createRequestAction({
  prefix: "search",
  apiPath: "search/users",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultKey: "items",
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
  resultConvert: function(result) {
    return result.list;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
