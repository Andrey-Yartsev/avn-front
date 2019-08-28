"use strict";

import { createRequestAction } from "../../utils/storeRequest";

const state = {
  afterAddCardRedirect: null
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
  });
};

mutations.setDefault = (state, id) => {
  state.cards = state.cards.map(v => {
    v.isDefault = v.id === id;
    return v;
  });
};

mutations.remove = (state, id) => {
  state.cards = state.cards.filter(v => {
    return v.id !== id;
  });
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
