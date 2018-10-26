"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};
const actions = {};
const mutations = {};

createRequestAction({
  prefix: "fetch",
  apiPath: "payments/transactions",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {
      offset: 0,
      limit: 10
    }
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
