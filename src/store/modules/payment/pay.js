"use strict";

import { createRequestAction } from "../../utils/storeRequest";

const state = {};

const actions = {
  // pay({ dispatch }) {
  //   return new Promise((accept, reject) => {
  //     dispatch("_pay").then().catch((err) => {
  //       console.log(err);
  //     });
  //   });
  // }
};

const mutations = {};

createRequestAction({
  prefix: "pay",
  apiPath: "payments/pay",
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
  localError: true
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
