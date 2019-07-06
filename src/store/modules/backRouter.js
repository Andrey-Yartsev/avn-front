const state = {
  stack: []
};

const actions = {};

const mutations = {
  push(state, route) {
    if (route.hash && route.hash.match(/^#m\//)) {
      return;
    }
    if (state.stack.length) {
      let prev = state.stack[state.stack.length - 1];
      if (prev.name === "profile") {
        return;
      }
      if (prev.path === route.path) {
        return;
      }
    }
    state.stack.push(route);
  },
  pop(state) {
    state.stack.pop();
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
