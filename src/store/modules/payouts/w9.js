"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};
const actions = {};
const mutations = {};

createRequestAction({
  prefix: "save",
  apiPath: "payouts/w9",
  state,
  mutations,
  actions,
  resultKey: "fetchResult",
  options: {
    method: "POST"
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
