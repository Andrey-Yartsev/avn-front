"use strict";

import { createRequestAction } from "../../utils/storeRequest";

const state = {};

const mutations = {
  reset(state) {
    state.users = [];
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
    method: "GET",
    query: {
      limit: 7
    }
  },
  resultKey: "users",
  defaultResultValue: [],
  paramsToOptions: function(params, options) {
    options.query.query = params;
    return options;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
