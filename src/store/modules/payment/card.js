"use strict";

import { createRequestAction } from "../../utils/storeRequest";

const state = {
  afterAddCardRedirect: null
};

const actions = {
  delete({ dispatch }) {
    dispatch("deleteRequest").then(() => {
      dispatch(
        "auth/extendUser",
        { isPaymentCardConnected: false },
        { root: true }
      );
    });
  }
};

const mutations = {
  setAfterAddCardRedirect(state, path) {
    state.afterAddCardRedirect = path;
  },
  resetAfterAddCardRedirect(state) {
    state.afterAddCardRedirect = null;
  }
};

createRequestAction({
  prefix: "fetch",
  apiPath: "payments/card",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultKey: "card",
  resultConvert: function(result) {
    return result.card;
  }
});

createRequestAction({
  prefix: "deleteRequest",
  apiPath: "payments/card",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  resultKey: "card",
  resultConvert: function() {
    return null;
  }
});

createRequestAction({
  prefix: "add",
  apiPath: "payments/card",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  },
  throw400: true
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
