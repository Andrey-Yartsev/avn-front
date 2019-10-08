"use strict";

import balances from "./referrals/balances";
import requests from "./referrals/requests";

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
  defaultResultValue: [],
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
  mutations,
  modules: {
    balances,
    requests
  }
};
