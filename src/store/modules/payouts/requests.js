"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};
const actions = {};
const mutations = {};

createRequestAction({
  prefix: "fetch",
  apiPath: "payouts/requests",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "withdraw",
  apiPath: "payouts/requests",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
