"use strict";

import { createRequestAction } from "../utils/storeRequest";

const state = {};
const actions = {};
const mutations = {};

createRequestAction({
  prefix: "fetchFinance",
  apiPath: "users/statistics/finance/{period}",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{period}/, params);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
