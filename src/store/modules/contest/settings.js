"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};

const mutations = {};

const actions = {};

createRequestAction({
  prefix: "fetch",
  requestType: "token",
  apiPath: "contests/me",
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
