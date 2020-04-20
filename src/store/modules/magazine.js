"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};

const actions = {
  subscribe({ dispatch, commit }, data) {
    delete data.country;
    delete data.state;
    data.hasOfflineSubscription = true;
    data.magazines = data.kinds.map(v => v.name);
    delete data.kinds;

    dispatch("update", data).then(r => {
      commit("setFetchStatus", r);
      commit("subscribe");
    });
  },
  reset({ dispatch, commit }) {
    dispatch("remove").then(r => {
      if (r.success) {
        commit("unsubscribe");
      }
    });
  },
  unsubscribe({ dispatch, commit, state }) {
    const current = state.fetchStatusResult.shipping;
    const data = { ...current };
    data.hasOfflineSubscription = false;
    data.countryId = current.country.id;
    data.stateId = current.state.id;
    delete data.country;
    delete data.state;
    dispatch("update", data).then(() => {
      commit("unsubscribe");
    });
  }
};

const mutations = {
  subscribe(state) {
    state.fetchStatusResult.shipping.hasOfflineSubscription = true;
  },
  unsubscribe(state) {
    state.fetchStatusResult.shipping.hasOfflineSubscription = false;
  },
  setFetchStatus(state, fetchStatusResult) {
    state.fetchStatusResult = fetchStatusResult;
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
