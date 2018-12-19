"use strict";

import { createRequestAction } from "../utils/storeRequest";
import confirm from "./subscription/confirm";

const state = {
  updated: null
};

const actions = {
  openPaymentModal({ dispatch }, user) {
    dispatch("fetchPaymentLink", {
      type: "subscription",
      amount: user.subscribePrice,
      id: user.id
    }).then(() => {
      dispatch(
        "modal/show",
        {
          type: "subscription",
          name: "payment",
          data: {
            user
          }
        },
        { root: true }
      );
    });
  },
  unsubscribe({ commit, dispatch }, data) {
    dispatch("_unsubscribe", data).then(result => {
      commit("statusUpdate", {
        action: "unsubscribe",
        result,
        data
      });
    });
  }
};

const mutations = {
  statusUpdate(state, data) {
    state.updated = data;
  }
};

createRequestAction({
  prefix: "fetchPaymentLink",
  apiPath: "payments/link",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultKey: "paymentLink",
  paramsToOptions: function(params, options) {
    options.query = params;
    return options;
  },
  resultConvert: function(result) {
    return result.link;
  }
});

createRequestAction({
  prefix: "_unsubscribe",
  apiPath: "subscriptions/unsubscribe",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

createRequestAction({
  prefix: "resubscribe",
  apiPath: "subscriptions/resubscribe",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  modules: {
    confirm
  }
};
