"use strict";

import { createRequestAction } from "../utils/storeRequest";

const state = {};

const actions = {
  openPaymentModal({ dispatch }, data) {
    dispatch("fetchPaymentLink", data).then(() => {
      dispatch(
        "modal/show",
        {
          name: "payment",
          data: {
            userId: data.id
          }
        },
        { root: true }
      );
    });
  },
  unsubscribe({ dispatch }, data) {
    dispatch("unsubscribeRequest", data).then(r => {
      if (r.success) {
        dispatch(
          "profile/home/extend",
          {
            subscribedByExpire: true
          },
          { root: true }
        );
        dispatch("global/flashToast", "You have unsubscribed successfully", {
          root: true
        });
      }
    });
  },
  resubscribe({ dispatch }, data) {
    dispatch("resubscribeRequest", data).then(r => {
      if (r.success) {
        dispatch(
          "profile/home/extend",
          {
            subscribedByExpire: false
          },
          { root: true }
        );
        dispatch("global/flashToast", "You have resubscribed successfully", {
          root: true
        });
      }
    });
  }
};

const mutations = {};

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
  prefix: "unsubscribeRequest",
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
  prefix: "resubscribeRequest",
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
  mutations
};
