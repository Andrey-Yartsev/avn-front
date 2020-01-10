import { createRequestAction } from "../../utils/storeRequest";
// import mockMedia from "../../../mock/media";

const fetchLimit = 9;

const initState = {
  // media: mockMedia,
  media: [],
  editedMedia: null,
  marker: null,
  offset: 0,
  limit: fetchLimit,
  allDataReceived: false,
  preloadedMedias: []
};

const state = { ...initState };

const mutations = {
  clearMedia(state) {
    state.media = [];
    state.offset = 0;
    state.allDataReceived = false;
  },
  startEditMedia(state, payload) {
    state.editedMedia = payload;
  },
  endEditMedia(state) {
    state.editedMedia = null;
  },
  addMedia(state, newMedias) {
    state.media = [...state.media, ...newMedias];
  },
  addMediaItem(state, newMedias) {
    state.media = [...newMedias, ...state.media];
  },
  updateMedia(state, updatedMedia) {
    state.media = state.media.map(item => {
      return item.productId === updatedMedia.productId ? updatedMedia : item;
    });
  },
  deleteMedia(state, productId) {
    state.media = state.media.filter(item => item.productId !== productId);
  },
  incrementViewCounter(state, productId) {
    const viewedMedia = state.media.find(item => item.productId === productId);
    viewedMedia.views++;
  },
  isAllDataRecieved(state, length) {
    if (length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + state.limit;
    }
  },
  updateMediaSrc(state, data) {
    state.media = state.media.map(item => {
      if (item.productId == data.id) {
        return {
          ...item,
          media: {
            ...item.media,
            type: "video",
            duration: data.duration,
            src: {
              ...item.media.src,
              source: data.url
            }
          }
        };
      }
      return item;
    });
  },
  updateMediaPreviewSrc(state, data) {
    state.media = state.media.map(item => {
      if (item.productId == data.id) {
        return {
          ...item,
          media: {
            ...item.media,
            videoPreview: {
              ...item.media.videoPreview,
              source: data.url,
              status: data.status
            }
          }
        };
      }
      return item;
    });
  }
};

const actions = {
  getMedia({ dispatch, commit, state }, { profileId, filter, sort }) {
    return dispatch("_getMedia", {
      profileId,
      offset: state.offset,
      filter,
      sort
    }).then(res => {
      commit("addMedia", res);
      commit("isAllDataRecieved", res.length);
    });
  },
  getMediaItem({ dispatch, commit }, data) {
    dispatch("_getMediaItem", data).then(res => {
      commit("updateMedia", res);
      commit("mediaPage/updateMediaItem", res, { root: true });
    });
  },
  deleteMedia({ dispatch, commit }, mediaId) {
    dispatch("_deleteMedia", mediaId).then(() => {
      commit("deleteMedia", mediaId);
      dispatch(
        "global/flashToast",
        { text: "Vide deleted successfully" },
        {
          root: true
        }
      );
      commit("auth/decrementStoreCount", null, { root: true });
      commit("endEditMedia");
    });
  },
  addMedia({ dispatch, commit }, data) {
    return dispatch("_addMedia", data).then(res => {
      commit("addMediaItem", res);
      dispatch(
        "global/flashToast",
        { text: "New video successfully uploaded" },
        {
          root: true
        }
      );
      commit("auth/incrementStoreCount", res.length, { root: true });
    });
  },
  updateMedia({ dispatch, commit }, data) {
    return dispatch("_updateMedia", data).then(res => {
      commit("updateMedia", res);
      commit("mediaPage/updateMediaItem", res, { root: true });
    });
  },
  incrementViewCounter({ dispatch, commit }, productId) {
    dispatch("_incrementViewCounter", productId).then(() => {
      commit("incrementViewCounter", productId);
    });
  },
  updateMediaSrc({ commit }, data) {
    commit("updateMediaSrc", data);
  },
  updateMediaPreviewSrc({ commit }, data) {
    commit("updateMediaPreviewSrc", data);
  }
};

createRequestAction({
  requestType: "any",
  prefix: "_getMedia",
  apiPath: "media/{userId}",
  // resultKey: "media",
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
    options.query.filter = params.filter;
    options.query.sort = params.sort;
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params.profileId);
  }
});
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

createRequestAction({
  prefix: "_addMedia",
  apiPath: "media",
  // resultKey: "media",
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
});

createRequestAction({
  prefix: "_updateMedia",
  apiPath: "media/{productId}",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToPath: function(data, path) {
    return path.replace(/{productId}/, data.productId);
  },
  paramsToOptions: function(params, options) {
    options.data = params.media;
    return options;
  }
});

createRequestAction({
  prefix: "_incrementViewCounter",
  apiPath: "media/views/{mediaId}",
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
  // resultKey: "media",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(mediaId, path) {
    return path.replace(/{mediaId}/, mediaId);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
