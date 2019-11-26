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
  addMedia(state, newMedia) {
    state.media = [...state.media, newMedia];
  },
  updateMedia(state, updatedMedia) {
    state.media = state.media.map(item =>
      item.id === updatedMedia.id ? updatedMedia : item
    );
  },
  deleteMedia(state, id) {
    state.media = state.media.filter(item => item.id !== id);
  },
  incrementViewCounter(state, id) {
    const viewedMedia = state.media.find(item => item.id === id);
    viewedMedia.views++;
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
    commit("addMedia", data);
    commit("auth/incrementFollowingCount", null, { root: true });
  },
  updateMedia({ dispatch, commit }, data) {
    const res = dispatch("_updataMedia", data);
    commit("updateMedia", res);
  },
  async incrementViewCounter({ dispatch, commit }, mediaId) {
    await dispatch("_incrementViewCounter", mediaId);
    commit("incrementViewCounter", mediaId);
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
  prefix: "_updateMedia",
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
  prefix: "_incrementViewCounter",
  apiPath: "media/views/{mediaId}",
  // resultKey: "media",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToPath: function(mediaId, path) {
    return path.replace(/{mediaId}/, mediaId);
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
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
