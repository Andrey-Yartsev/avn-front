"use strict";

import { createRequestAction } from "../utils/storeRequest";

const state = {
  loading: false,
  error: null,
  sessions: []
};

const actions = {
  deleteAll({ dispatch, commit, state }) {
    Promise.all(
      state.sessions.map(session => {
        return new Promise(resolve => {
          dispatch("delete", session.id).then(resolve);
        });
      })
    );
    commit("deleteAll");
  }
};

const mutations = {
  setSessions(state, sessions) {
    state.sessions = sessions;
  },
  delete(state, id) {
    state.sessions = state.sessions.filter(v => v.id !== id);
  },
  deleteAll(state) {
    state.sessions = [];
  }
};

createRequestAction({
  prefix: "fetch",
  apiPath: "sessions",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultKey: "sessions"
});

createRequestAction({
  prefix: "delete",
  apiPath: "sessions/{id}",
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

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
