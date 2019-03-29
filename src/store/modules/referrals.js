"use strict";

import { createRequestAction } from "../utils/storeRequest";

const state = {};

const actions = {};

const mutations = {};

createRequestAction({
  prefix: "fetch",
  apiPath: "referrals",
  requestType: "token",
  resultKey: "items",
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
