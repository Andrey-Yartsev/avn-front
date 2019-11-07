import { createRequestAction } from "../utils/storeRequest";

const state = {};

const actions = {
  unblock({ dispatch }, userId) {
    return dispatch("user/unblock", userId, { root: true });
  },
  unblockPosts({ dispatch }, userId) {
    return dispatch("home/unspamPost", userId, { root: true });
  }
};

const mutations = {
  remove(state, id) {
    state.blocked = state.blocked.filter(v => v.id !== id);
  }
};

createRequestAction({
  prefix: "fetchBlocked",
  apiPath: `users/blocked`,
  state,
  mutations,
  actions,
  defaultResultValue: [],
  resultKey: "blocked",
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "fetchBlockedPosts",
  apiPath: `users/blocked`,
  state,
  mutations,
  actions,
  defaultResultValue: [],
  resultKey: "blockedPosts",
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
