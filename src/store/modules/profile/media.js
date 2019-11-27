import { createRequestAction } from "../../utils/storeRequest";
import mockMediaResponse from "./mockMedia.json";

const fetchLimit = 10;

const initState = {
  media: mockMediaResponse.list,
  editedMedia: null,
  marker: null,
  offset: 0,
  limit: 10,
  allDataReceived: false
};

const state = { ...initState };

const mutations = {
  startEditMedia(state, payload) {
    state.editedMedia = payload;
  },
  endEditMedia(state) {
    state.editedMedia = null;
  },
  addMedia(state, newMedias) {
    state.media = [...state.media, ...newMedias];
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
  },
  isAllDataRecieved(state, length) {
    if (length < state.limit) {
      state.isAllDataRecieved = true;
    } else {
      state.offset = state.offset + state.limit;
    }
  }
};

const actions = {
  getMedia({ dispatch, commit, state }, profileId) {
    return dispatch("_getMedia", {
      profileId,
      offset: state.offset
    }).then(res => {
      commit("isAllDataRecieved", res.length);
    });
  },
  async deleteMedia({ dispatch, commit }, mediaId) {
    await dispatch("_deleteMedia", mediaId);
    commit("deleteMedia", mediaId);
    commit("endEditMedia");
  },
  addMedia({ dispatch, commit }, data) {
    dispatch("_addMedia", data).then(res => {
      commit("addMedia", res);
    });
  },
  updateMedia({ dispatch, commit }, data) {
    dispatch("_updateMedia", data).then(res => {
      commit("updateMedia", res);
    });
  },
  async incrementViewCounter({ dispatch, commit }, mediaId) {
    await dispatch("_incrementViewCounter", mediaId);
    commit("incrementViewCounter", mediaId);
  }
};

createRequestAction({
  requestType: "any",
  prefix: "_getMedia",
  apiPath: "media/{userId}",
  resultKey: "media",
  state,
  mutations,
  actions,
  paramsToOptions: function(params) {
    const options = {
      method: "GET",
      query: {}
    };
    options.query.offset = params.offset || 0;
    options.query.limit = fetchLimit;
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params.profileId);
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
  }
  // resultConvert: function(newMedia, state) {
  //   const arr = newMedia.pinned
  //     ? [newMedia, ...state.media]
  //     : [...state.media, newMedia];
  //   return arr;
  // }
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
    options.data = params.media;
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
