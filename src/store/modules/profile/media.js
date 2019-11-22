import { createRequestAction } from "../../utils/storeRequest";
import mockMediaResponse from "./mockMedia.json";

const initState = {
  media: mockMediaResponse.list,
  editedMedia: null
};

const state = { ...initState };

const mutations = {
  startEditMedia(state, payload) {
    state.editedMedia = payload;
  },
  endEditMedia(state) {
    state.editedMedia = null;
  },
  deleteMedia(state, id) {
    state.media = state.media.filter(item => item.id !== id);
  }
};

const actions = {
  async deleteMedia({ dispatch, commit }, mediaId) {
    await dispatch("_deleteMedia", mediaId);
    commit("deleteMedia", mediaId);
    commit("endEditMedia");
    commit("auth/decrementFollowingCount", null, { root: true });
  },
  async addMedia({ dispatch, commit }, data) {
    await dispatch("_addMedia", data);
    commit("auth/incrementFollowingCount", null, { root: true });
  }
};

createRequestAction({
  requestType: "any",
  prefix: "getMedia",
  apiPath: "media/{userId}",
  resultKey: "media",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params);
  },
  resultConvert: function(res) {
    const media = res.list.sort(a => (a.pinned ? -1 : 1));
    return media;
  }
});

createRequestAction({
  prefix: "_addMedia",
  apiPath: "media",
  resultKey: "media",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  },
  resultConvert: function(newMedia, state) {
    const arr = newMedia.pinned
      ? [newMedia, ...state.media]
      : [...state.media, newMedia];
    return arr;
  }
});

createRequestAction({
  prefix: "updateMedia",
  apiPath: "media/{mediaId}",
  resultKey: "media",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToPath: function(data, path) {
    return path.replace(/{mediaId}/, data.id);
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  },
  resultConvert: function(newMedia, state) {
    const arr = state.media.map(item =>
      item.id === newMedia.id ? newMedia : item
    );
    return arr;
  }
});

createRequestAction({
  prefix: "_deleteMedia",
  apiPath: "media/{mediaId}",
  resultKey: "media",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(mediaId, path) {
    return path.replace(/{mediaId}/, mediaId);
  },
  resultConvert: function(res, state) {
    return state.media;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
