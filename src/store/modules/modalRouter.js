"use strict";

const state = {
  route: null,
  path: "",
  params: null,
  loading: false,
  stack: []
};

const base = path => {
  const m = path.match(/([^/]+)\/.*/);
  if (m) {
    return m[1];
  } else {
    return path;
  }
};

const mutations = {
  updateRoute(state, route) {
    state.route = route;
  },
  updatePath(state, path) {
    state.path = path;
    if (!path) {
      state.stack.pop();
    } else {
      if (!state.stack.length) {
        state.stack.push(path);
      } else {
        const last = state.stack[state.stack.length - 1];
        if (base(last) !== base(path)) {
          state.stack.push(path);
        } else {
          // if it's the same component, replace last
          state.stack.pop();
          state.stack.push(path);
        }
      }
    }
  },
  updateParams(state, params) {
    state.params = params;
  },
  updateLoading(state, loading) {
    state.loading = loading;
  },
  resetStack(state) {
    state.stack = [];
  }
};

const actions = {
  updatePath({ commit }, path = "") {
    commit;
    window.location.hash = "m/" + path;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
