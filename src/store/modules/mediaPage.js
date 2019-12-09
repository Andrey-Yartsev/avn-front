import { createRequestAction } from "../utils/storeRequest";

const initState = {
  media: null
};

const state = { ...initState };

const mutations = {
  resetMediaState(state) {
    state.media = null;
  },
  setMedia(state, item) {
    state.media = item;
  },
  updateMediaItem(state, item) {
    if (state.media) {
      state.media = item;
    }
  }
};

const actions = {
  getMediaItem({ commit, dispatch }, { productId }) {
    commit("resetMediaState");
    dispatch("_getMediaItem", { productId }).then(res => {
      commit("setMedia", res);
    });
  }
};

createRequestAction({
  requestType: "any",
  prefix: "_getMediaItem",
  apiPath: "media/view/{productId}",
  // resultKey: "media",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{productId}/, params.productId);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
