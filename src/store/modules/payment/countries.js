"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};
const actions = {};
const mutations = {
  reset(state) {
    state.fetchResult = [];
  }
};

createRequestAction({
  prefix: "fetch",
  apiPath: "countries",
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
