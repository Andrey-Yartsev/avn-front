"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const state = {};
const actions = {
  save({ dispatch }, data) {
    return new Promise(accept => {
      dispatch("_save", data).then(r => {
        accept(r);
        dispatch(
          "auth/extendUser",
          {
            canEarn: true
          },
          { root: true }
        );
      });
    });
  }
};
const mutations = {};

createRequestAction({
  prefix: "fetch",
  apiPath: "payouts/bank",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "_save",
  apiPath: "payouts/bank",
  state,
  mutations,
  actions,
  resultKey: "fetchResult",
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
