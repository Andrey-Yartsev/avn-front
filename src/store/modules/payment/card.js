"use strict";

import { createRequestAction } from "../../utils/storeRequest";
import Store from "@/store";

const state = {
  afterAddCardRedirect: null,
  cards: []
};

const actions = {};

const mutations = {
  setAfterAddCardRedirect(state, path) {
    state.afterAddCardRedirect = path;
  },
  resetAfterAddCardRedirect(state) {
    state.afterAddCardRedirect = null;
  }
};

createRequestAction({
  prefix: "fetch",
  apiPath: "payments/cards",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultKey: "cards"
});

createRequestAction({
  prefix: "_remove",
  apiPath: "payments/cards/{id}",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{id}/, params);
  }
});

createRequestAction({
  prefix: "add",
  apiPath: "payments/cards",
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
  throw400: true
});

createRequestAction({
  prefix: "_setDefault",
  apiPath: "payments/cards/{id}/default",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{id}/, params);
  },
  throw400: true
});

actions.setDefault = ({ dispatch, commit }, id) => {
  dispatch("_setDefault", id).then(() => {
    commit("setDefault", id);
  });
};

actions.remove = ({ dispatch, commit }, id) => {
  dispatch("_remove", id).then(() => {
    commit("remove", id);
    dispatch("fetch");
  });
};

mutations.setDefault = (state, id) => {
  state.cards = state.cards.map(v => {
    v.isDefault = v.id === id;
    return v;
  });
};

mutations.remove = (state, id) => {
  const filteredCards = state.cards.filter(v => {
    return v.id !== id;
  });
  if (!filteredCards.length) {
    Store.commit("auth/reconnectPaymentCard", null, { root: true });
  }
  state.cards = filteredCards;
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
