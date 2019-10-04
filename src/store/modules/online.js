"use strict";

const state = {
  users: []
};

const actions = {};

const mutations = {
  updateUsers(state, users) {
    users = users.map(v => parseInt(v));
    state.users = users;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
