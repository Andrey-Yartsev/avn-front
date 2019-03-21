"use strict";

import { createRequestAction } from "../utils/storeRequest";
import confirm from "./subscription/confirm";
import subsAction from "@/helpers/subsAction";

const state = {
  updated: null
};

const actions = {
  openPaymentModal({ dispatch }, { user, actionPrefix }) {
    return new Promise(accept => {
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
              user,
              actionPrefix
            }
          },
          { root: true }
        );
        accept();
      });
    });
  },
  unsubscribe({ commit, dispatch }, data) {
    return dispatch("_unsubscribe", data).then(result => {
      commit("statusUpdate", {
        action: "unsubscribe",
        result,
        data
      });
    });
  },
  openSubscribeModal({ dispatch }, user) {
    dispatch("fetchProfile", user.username).then(profile => {
      if (subsAction(profile) === "subscribe") {
        dispatch(
          "modal/show",
          {
            name: "subscribe",
            data: {
              user: user
            }
          },
          { root: true }
        );
      } else {
        dispatch(
          "modal/show",
          {
            name: "resubscribe",
            data: user
          },
          { root: true }
        );
      }
    });
  },
  success({ dispatch, commit, rootState }) {
    const payment = rootState.modal.subscribe.data;
    dispatch(
      "global/flashToast",
      `Subscription to ${payment.user.name} is successful`,
      { root: true }
    );
    if (rootState.profile.home.profile) {
      if (rootState.profile.home.profile.id === payment.user.id) {
        dispatch(
          "profile/home/extend",
          {
            subscribedBy: true
          },
          { root: true }
        );
        commit("profile/home/resetPosts", { root: true });
        dispatch("profile/home/getPosts", { root: true });
      }
    }
    commit(
      payment.actionPrefix + "/extendUser",
      {
        userId: payment.user.id,
        data: {
          subscribedBy: true,
          subscribedByExpire: false
        }
      },
      { root: true }
    );
  }
};

const mutations = {
  statusUpdate(state, data) {
    state.updated = data;
  }
};

createRequestAction({
  requestType: "any",
  prefix: "fetchProfile",
  apiPath: "users/{username}",
  state,
  mutations,
  actions,
  resultKey: "profile",
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{username}/, params);
  }
});

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
