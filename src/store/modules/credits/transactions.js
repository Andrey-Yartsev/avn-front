"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};
const actions = {};
const mutations = {};

createRequestAction({
  prefix: "fetch",
  apiPath: "credits/transactions",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {
      offset: 0,
      limit: 50
    }
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
