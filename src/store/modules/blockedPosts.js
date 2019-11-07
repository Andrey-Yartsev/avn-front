import { createRequestAction } from "../utils/storeRequest";

const state = {};

const actions = {
  unblock({ dispatch }, userId) {
    return dispatch("home/unspamPost", userId, { root: true });
  }
};

const mutations = {
  filterPosts(state, userId) {
    state.blocked = state.blocked.filter(item => item.id !== userId);
  }
};

createRequestAction({
  prefix: "fetchBlocked",
  apiPath: `users/filtered`,
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
