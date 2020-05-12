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
  preloadedMedias: [],
  mediaCategories: null,
  separateMedia: null
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
    if (state.media.length) {
      const filteredMedia = newMedias.filter(item => {
        const existedMedia = state.media.find(
          media => media.productId === item.productId
        );
        return existedMedia ? false : true;
      });
      state.media = [...state.media, ...filteredMedia];
    } else {
      state.media = [...newMedias];
    }
  },
  addMediaItem(state, newMedias) {
    state.media = [...newMedias, ...state.media];
    // state.offset++;
  },
  updateMedia(state, updatedMedia) {
    state.media = state.media.map(item => {
      return item.productId === updatedMedia.productId ? updatedMedia : item;
    });
    if (state.separateMedia) {
      state.separateMedia = updatedMedia;
    }
  },
  deleteMedia(state, productId) {
    state.media = state.media.filter(item => item.productId !== productId);
    state.offset--;
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
    const isAudio = !data.width && !data.height;
    state.media = state.media.map(item => {
      if (item.productId == data.id) {
        return {
          ...item,
          media: {
            ...item.media,
            type: isAudio ? "audio" : "video",
            duration: data.duration,
            src: {
              source: data.url,
              width: data.width,
              height: data.height
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
  },
  setMediaCategories(state, data) {
    if (data.length) {
      data.sort((a, b) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      });
    }
    const formatedData = data.map(item => ({
      ...item,
      name: item.name.replace(/&amp;/g, "&")
    }));
    state.mediaCategories = formatedData;
  },
  setSeparateMedia(state, data) {
    state.separateMedia = data;
  },
  removeSeparateMedia(state) {
    state.separateMedia = null;
  },
  updateFollowStatus(state) {
    state.media = state.media.map(item => {
      const newItem = item;
      newItem.author.followedBy = true;
      return newItem;
    });
    if (state.separateMedia) {
      state.separateMedia.author.followedBy = true;
    }
  },
  likeMediaSuccess(state, { productId, isFavorite, favoritesCount }) {
    state.media = state.media.map(item => {
      if (productId === item.id) {
        return {
          ...item,
          isFavorite,
          favoritesCount
        };
      }

      return item;
    });
    if (state.separateMedia && state.separateMedia.id === productId) {
      state.separateMedia = {
        ...state.separateMedia,
        isFavorite,
        favoritesCount
      };
    }
  }
};

const actions = {
  getMedia(
    { dispatch, commit, state },
    { profileId, filter, sort, categories }
  ) {
    return dispatch("_getMedia", {
      profileId,
      offset: state.offset,
      filter,
      sort,
      categories
    }).then(res => {
      commit("addMedia", res);
      commit("isAllDataRecieved", res.length);
    });
  },
  getMediaItem({ dispatch, commit }, data) {
    dispatch("_getMediaItem", data).then(res => {
      commit("updateMedia", res);
      commit("mediaPage/updateMediaItem", res, { root: true });
      commit("explore/updateStorePost", res, { root: true });
    });
  },
  getMediaItemForModal({ dispatch, commit }, data) {
    return dispatch("_getMediaItem", data).then(res => {
      commit("setSeparateMedia", res);
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
  },
  getMediaCategories({ dispatch, commit }) {
    return dispatch("_getMediaCategories")
      .then(res => {
        commit("setMediaCategories", res);
      })
      .catch(err => {
        console.log(err);
      });
  },
  sendViewStatistics({ dispatch }, productId) {
    dispatch("_sendViewStatistics", productId);
  },
  getMediaForPreview({ dispatch }, productId) {
    return dispatch("_getMediaItemThumbs", { productId });
  },
  generateAccessLink({ dispatch }, productId) {
    return dispatch("_generateAccessLink", productId);
  },
  getFreeAccess({ dispatch }, data) {
    return dispatch("_getFreeAccess", data);
  },
  generateFullAccessLink({ dispatch }) {
    return dispatch("_generateFullAccessLink");
  },
  getFullFreeAccess({ dispatch }, data) {
    return dispatch("_getFullFreeAccess", data);
  },
  likeMedia({ dispatch, commit }, { productId, action }) {
    return dispatch(`_${action}Media`, productId).then(res => {
      const { isFavorite, favoritesCount } = res;
      commit("likeMediaSuccess", { productId, isFavorite, favoritesCount });
    });
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
    options.query.categories = params.categories;
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
  localError: true,
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
  requestType: "any",
  prefix: "_getMediaItemThumbs",
  apiPath: "media/thumb/{productId}",
  localError: true,
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
  requestType: "any",
  prefix: "_getMediaCategories",
  apiPath: "media/categories",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
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

createRequestAction({
  requestType: "any",
  prefix: "_sendViewStatistics",
  apiPath: "media/{productId}/watched",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToPath: function(productId, path) {
    return path.replace(/{productId}/, productId);
  }
});

createRequestAction({
  prefix: "_generateAccessLink",
  apiPath: "media/{productId}/accessLink",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(productId, path) {
    return path.replace(/{productId}/, productId);
  }
});

createRequestAction({
  requestType: "any",
  prefix: "_getFreeAccess",
  apiPath: "media/{productId}/accessLink",
  state,
  mutations,
  actions,
  throw400: true,
  options: {
    method: "POST"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{productId}/, params.productId);
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

createRequestAction({
  prefix: "_generateFullAccessLink",
  apiPath: "media/accessLink",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

createRequestAction({
  requestType: "any",
  prefix: "_getFullFreeAccess",
  apiPath: "media/accessLink",
  state,
  mutations,
  actions,
  throw400: true,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

createRequestAction({
  prefix: "_likeMedia",
  apiPath: "media/{productId}/favorites",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToPath: function(productId, path) {
    return path.replace(/{productId}/, productId);
  }
});

createRequestAction({
  prefix: "_unlikeMedia",
  apiPath: "media/{productId}/favorites",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(productId, path) {
    return path.replace(/{productId}/, productId);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
