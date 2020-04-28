"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};

const actions = {
  subscribeOfflineForm({ dispatch, commit }, data) {
    delete data.country;
    delete data.state;
    data.hasOfflineSubscription = true;
    data.magazines = data.kinds.map(v => v.name);
    delete data.kinds;
    dispatch("update", data).then(r => {
      console.log(r.shipping);
      commit("extendShipping", r.shipping);
    });
  },
  updateOfflineForm({ dispatch, commit }, data) {
    delete data.country;
    delete data.state;
    data.magazines = data.kinds.map(v => v.name);
    delete data.kinds;
    dispatch("update", data).then(r => {
      commit("extendShipping", r.shipping);
    });
  },
  subscribeOffline({ dispatch }) {
    return dispatch("_update", {
      hasOfflineSubscription: true
    });
  },
  unsubscribeOffline({ dispatch }) {
    return dispatch("_update", {
      hasOfflineSubscription: false
    });
  },
  subscribeDigitalMagazine({ dispatch }) {
    return dispatch("_update", {
      hasDigitalMagazineSubscription: true
    });
  },
  unsubscribeDigitalMagazine({ dispatch }) {
    return dispatch("_update", {
      hasDigitalMagazineSubscription: false
    });
  },
  _update({ dispatch, commit, state }, extend) {
    const current = state.fetchShippingResult;
    const data = { ...current, ...extend };
    if (current.country) {
      data.countryId = current.country.id;
      data.stateId = current.state.id;
      delete data.country;
      delete data.state;
    }
    dispatch("update", data).then(() => {
      commit("extendShipping", extend);
    });
  },
  resetOffline({ dispatch, commit, state }) {
    const data = { ...state.fetchShippingResult };
    data.id = 0;
    commit("extendShipping", data);
    dispatch("remove");
  }
};

const mutations = {
  extendShipping(state, data) {
    state.fetchShippingResult = { ...state.fetchShippingResult, ...data };
  }
};

createRequestAction({
  prefix: "update",
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
  prefix: "remove",
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
  prefix: "fetchShipping",
  requestType: "token",
  apiPath: "users/offline/shipping",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultConvert: function(res) {
    return res.shipping;
  }
});

createRequestAction({
  prefix: "pay",
  apiPath: "payments/pay/magazine",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    if (window.okev) {
      options.data.sentry = JSON.stringify(window.okev.all());
    }
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
