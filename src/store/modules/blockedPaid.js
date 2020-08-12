import { createRequestAction } from "../utils/storeRequest";

const state = {};

const actions = {
  unblock({ dispatch }, userId) {
    return dispatch("user/paidUnblock", userId, { root: true });
  },
  filterBlocked({ commit }, userId) {
    commit("filterUsers", userId);
  }
};

const mutations = {
  remove(state, id) {
    state.blocked = state.blocked.filter(v => v.id !== id);
  },
  filterUsers(state, userId) {
    state.blocked = state.blocked.filter(item => item.id !== userId);
  }
};

createRequestAction({
  prefix: "fetchBlocked",
  apiPath: `users/blockedPaid`,
  state,
  mutations,
  actions,
  defaultResultValue: [],
  resultKey: "blocked",
  options: {
    method: "GET"
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
