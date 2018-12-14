"use strict";

import SessionsApi from "@/api/sessions";

const state = {
  loading: false,
  error: null,
  sessions: []
};

const actions = {
  fetch({ commit }) {
    SessionsApi.fetch().then(async sessions => {
      commit("setSessions", await sessions.json());
    });
  },
  delete({ commit }, id) {
    return SessionsApi.delete(id).then(() => {
      commit("delete", id);
    });
  },
  deleteAll({ commit, state }) {
    Promise.all(
      state.sessions.map(session => {
        return new Promise(resolve => {
          SessionsApi.delete(session.id).then(resolve);
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

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
