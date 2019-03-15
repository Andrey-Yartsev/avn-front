"use strict";

import transactions from "./credits/transactions";

const state = {};
const actions = {};
const mutations = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  modules: {
    transactions
  }
};
