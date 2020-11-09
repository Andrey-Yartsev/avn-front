"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};
const actions = {
  credits({ commit, dispatch }, data) {
    return dispatch("_credits", data).then(res => {
      commit("updateAvailableBalance", res);
      return res;
    });
  }
};
const mutations = {
  updateAvailableBalance(state, { payoutAvailable }) {
    state.fetchResult.payoutAvailable = payoutAvailable;
  }
};

createRequestAction({
  prefix: "fetch",
  apiPath: "payouts/balances",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "_credits",
  apiPath: "payouts/credits",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  throw400: true,
  localError: true,
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
