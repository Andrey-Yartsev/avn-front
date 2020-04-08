"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};

const actions = {
  subscribe({ dispatch, commit }, data) {
    dispatch("_subscribe", data).then(r => {
      commit("setFetchStatus", r);
    });
  },
  unsubscribe({ dispatch, commit }) {
    dispatch("_unsubscribe").then(r => {
      if (r.success) {
        commit("unsubscribe");
      }
    });
  }
};

const mutations = {
  unsubscribe(state) {
    state.fetchStatusResult.shipping.hasOfflineSubscription = false;
  },
  setFetchStatus(state, fetchStatusResult) {
    state.fetchStatusResult = fetchStatusResult;
  }
};

createRequestAction({
  prefix: "_subscribe",
  requestType: "token",
  apiPath: "users/offline/shipping",
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

createRequestAction({
  prefix: "_unsubscribe",
  requestType: "token",
  apiPath: "users/offline/shipping",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  }
});

createRequestAction({
  prefix: "fetchStatus",
  requestType: "token",
  apiPath: "users/offline/shipping",
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
