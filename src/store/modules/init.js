"use strict";

import { createRequestAction } from "../utils/storeRequest";

const state = {};

const actions = {};

const mutations = {};

createRequestAction({
  prefix: "fetch",
  apiPath: "init",
  requestType: "no-token",
  resultKey: "data",
  defaultLoading: true,
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
