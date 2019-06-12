"use strict";

import card from "./payment/card";
import transactions from "./payment/transactions";
import pay from "./payment/pay";
import countries from "./payment/countries";

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
    transactions,
    pay,
    countries
  }
};
