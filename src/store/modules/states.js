"use strict";

import { createRequestAction } from "../utils/storeRequest";

const state = {};
const actions = {};
const mutations = {};

createRequestAction({
  prefix: "fetch",
  apiPath: "countries/{countryCode}/states",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{countryCode}/, params);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
