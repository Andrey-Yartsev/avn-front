"use strict";

import card from "./payment/card";
import transactions from "./payment/transactions";

const state = {};
const actions = {};
const mutations = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  modules: {
    card,
    transactions
  }
};
