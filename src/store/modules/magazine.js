"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {
  trigOfflineSubscription: 0
};

const actions = {
  // createShipping({ dispatch, commit }, _data) {
  //   const data = JSON.parse(JSON.stringify(_data));
  //   delete data.country;
  //   delete data.state;
  //   data.magazines = data.kinds.map(v => v.name);
  //   delete data.kinds;
  //   dispatch("update", data).then(r => {
  //     commit("extend", r.shipping);
  //   });
  // },
  updateShippingForm({ dispatch, commit }, _data) {
    const data = JSON.parse(JSON.stringify(_data));
    delete data.country;
    delete data.state;
    data.magazines = data.kinds.map(v => v.name);
    delete data.kinds;
    return dispatch("update", data).then(r => {
      commit("extend", r.shipping);
    });
  },
  subscribeOffline({ dispatch, commit }) {
    return dispatch("updateOffline", {
      hasOfflineSubscription: true
    }).then(() => {
      commit("extend", {
        hasOfflineSubscription: true
      });
    });
  },
  unsubscribeOffline({ dispatch, commit }) {
    return dispatch("updateOffline", {
      hasOfflineSubscription: false
    }).then(() => {
      commit("extend", {
        hasOfflineSubscription: false
      });
    });
  },
  subscribeDigitalMagazine({ dispatch, commit }) {
    return dispatch("updateDigital", {
      hasDigitalMagazineSubscription: true
    }).then(() => {
      commit("extend", {
        hasDigitalMagazineSubscription: true
      });
    });
  },
  unsubscribeDigitalMagazine({ dispatch, commit }) {
    dispatch("updateDigital", {
      hasDigitalMagazineSubscription: false
    }).then(() => {
      commit("extend", {
        hasDigitalMagazineSubscription: false
      });
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
      commit("extend", extend);
    });
  },
  resetOffline({ dispatch, commit, state }) {
    const data = { ...state.fetchShippingResult };
    data.id = 0;
    data.hasOfflineSubscription = false;
    commit("extend", data);
    dispatch("remove");
  }
};

const mutations = {
  extend(state, data) {
    state.fetchShippingResult = { ...state.fetchShippingResult, ...data };
  },
  trigOfflineSubscription(state) {
    state.trigOfflineSubscription++;
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

createRequestAction({
  prefix: "fetchMagazines",
  requestType: "token",
  apiPath: "magazines",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  defaultResultValue: []
});

createRequestAction({
  prefix: "updateDigital",
  requestType: "token",
  apiPath: "users/magazine/digital",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

createRequestAction({
  prefix: "updateOffline",
  requestType: "token",
  apiPath: "users/magazine/offline",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
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
