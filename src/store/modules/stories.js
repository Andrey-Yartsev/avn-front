"use strict";

import feed from "./stories/feed.js";
import explore from "./stories/explore.js";
import page from "./stories/page.js";
import { createRequestAction } from "../utils/storeRequest";

const state = {};

const mutations = {};

const actions = {
  extendPost({ commit }, post) {
    commit("stories/feed/extendPost", post, { root: true });
    commit("stories/explore/extendPost", post, { root: true });
    commit("stories/page/extendPost", post, { root: true });
  },
  async addRedirectLink({ dispatch }, data) {
    return dispatch("_addRedirectLink", data).then(res => {
      console.log(res);
      dispatch("updateStory", res.data);
    });
  },
  updateStory({ commit }, data) {
    commit("stories/feed/updatePostLink", data, { root: true });
    commit("stories/explore/updatePostLink", data, { root: true });
    commit("stories/page/updatePostLink", data, { root: true });
  }
};

createRequestAction({
  prefix: "_addRedirectLink",
  apiPath: "stories/{linkId}/link",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{linkId}/, params.storyId);
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

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
