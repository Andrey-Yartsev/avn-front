"use strict";

import feed from "./stories/feed.js";
import explore from "./stories/explore.js";
import page from "./stories/page.js";

const state = {};

const actions = {
  extendPost({ commit }, post) {
    commit("stories/feed/extendPost", post, { root: true });
    commit("stories/explore/extendPost", post, { root: true });
    commit("stories/page/extendPost", post, { root: true });
  }
};

export default {
  namespaced: true,
  state,
  actions,
  modules: {
    feed,
    explore,
    page
  }
};
