"use strict";

import account from "./payouts/account";
import legal from "./payouts/legal";
import bank from "./payouts/bank";
import balances from "./payouts/balances";
import requests from "./payouts/requests";
import transactions from "./payouts/transactions";
import countries from "./payouts/countries";
import w9 from "./payouts/w9";

const state = {};
const mutations = {};

const actions = {
  reset({ commit, dispatch }) {
    dispatch("payouts/account/fetchReset", null, { root: true });
    dispatch("payouts/legal/fetchReset", null, { root: true });
    dispatch("payouts/bank/fetchReset", null, { root: true });
    dispatch("payouts/requests/fetchReset", null, { root: true });
    commit("payouts/transactions/reset", null, { root: true });
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  modules: {
    account,
    legal,
    bank,
    balances,
    requests,
    transactions,
    countries,
    w9
  }
};
