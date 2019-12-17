"use strict";

import { createRequestAction } from "../../utils/storeRequest";

const state = {
  complete: null
};

const actions = {
  complete({ commit }, paymentType) {
    commit("complete", paymentType);
    setTimeout(() => {
      commit("complete", null);
    }, 100);
  }
};

const mutations = {
  complete(state, complete) {
    state.complete = complete;
  }
};

createRequestAction({
  prefix: "pay",
  apiPath: "payments/pay",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    options.data.sentry = JSON.stringify(window.okev.all());
    return options;
  },
  localError: true,
  throw400: true
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
