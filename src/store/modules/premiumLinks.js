"use strict";

import { createRequestAction } from "../utils/storeRequest";

const state = {};
const actions = {};
const mutations = {
  reset(state) {
    for (let k of Object.keys(state)) {
      state[k] = undefined;
    }
  }
};

createRequestAction({
  prefix: "fetch",
  apiPath: "users/products?contentType=snapchat",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "save",
  apiPath: "users/products/",
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
