"use strict";

import { createRequestAction } from "../utils/storeRequest";
import confirm from "./subscription/confirm";
import discounts from "./subscription/discounts";
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
  resubscribe({ commit, dispatch }, data) {
    return dispatch("_resubscribe", data).then(res => {
      commit(
        "auth/addItemToUserConnectedData",
        { key: "subscribe", id: data.userId },
        { root: true }
      );
      return res;
    });
  },
  unsubscribe({ commit, dispatch }, data) {
    return dispatch("_unsubscribe", data).then(result => {
      commit(
        "auth/removeItemFromUserConnectedData",
        { key: "subscribe", id: data.userId },
        { root: true }
      );
      commit("statusUpdate", {
        action: "unsubscribe",
        result,
        data
      });
    });
  },
  openSubscribeModal({ dispatch, commit }, user) {
    commit("global/setLoading", true, { root: true });
    dispatch("fetchProfile", user.username).then(profile => {
      commit("global/setLoading", false, { root: true });
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
      { text: `Subscription to ${payment.user.name} is successful` },
      { root: true }
    );
    if (rootState.profile.home.profile) {
      if (rootState.profile.home.profile.id === payment.user.id) {
        dispatch(
          "profile/home/extend",
          {
            subscribedBy: true,
            subscribedByProgress: false,
            isPrivatePost: false
          },
          { root: true }
        );
        commit("profile/home/resetPosts", null, { root: true });
        dispatch("profile/home/getPosts", null, { root: true });

        commit("highlights/resetPageState", null, { root: true });
        dispatch(
          "highlights/setSource",
          { source: rootState.profile.home.profile.id },
          { root: true }
        );
        dispatch("highlights/getPosts", null, { root: true });
      }
    }

    if (payment.actionPrefix) {
      commit(
        payment.actionPrefix + "/extendUser",
        {
          userId: payment.user.id,
          data: {
            subscribedBy: true,
            subscribedByProgress: false,
            isPrivatePost: false
          }
        },
        { root: true }
      );
    }

    commit("statusUpdate", {
      action: "subscribe",
      result: {
        success: true
      },
      data: {
        userId: payment.user.id
      }
    });
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
  prefix: "_resubscribe",
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
    confirm,
    discounts
  }
};
