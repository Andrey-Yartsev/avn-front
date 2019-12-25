import { createRequestAction } from "../../utils/storeRequest";

const fetchLimit = 9;

const initState = {
  media: [
    {
      productId: 1178,
      price: 12.3,
      active: true,
      title:
        "123 sodfsdf sfsdfs sdfksjadfls sfsdfsdf sdflksdfs sdfsdf sdfsdfsfs",
      text: "fgdfgdfgfdg",
      maxPrice: "500",
      buyCount: 0,
      author: {
        id: 468788,
        name: "имя",
        username: "user666",
        avatar:
          "https://avnsocial-dev.s3.amazonaws.com/files/i/if/ifz/ifzfcvs2l2uymmy6da7928egvdhnxh4f1575995191/avatar.jpg",
        header:
          "https://avnsocial-dev.s3.amazonaws.com/files/a/aw/awv/awvidf0aytegt7hse0iz8gybr5xhjslv1575995230/w500.jpg",
        headerFull:
          "https://avnsocial-dev.s3.amazonaws.com/files/b/b0/b02/b02ovsj95uucdwr7b0x6efcioajkdfw21575995228/header.jpg",
        canEarn: true,
        deleteRequested: false,
        hideBanking: false,
        publicUrl: "https://avn2.retloko.com/user666",
        hasNotViewedStory: false,
        hasStory: false,
        isVerified: false,
        storeEnabled: true,
        isBlocked: false,
        isMuted: false,
        isSubscribed: true,
        subscribePrice: "10.00",
        canPayoutsRequest: true,
        nominatable: true,
        category: 3,
        categoryView: 1,
        payments: {
          tipsLimit: {
            min: 2,
            max: 500
          }
        }
      },
      media: {
        id: 187,
        canView: true,
        type: "video",
        duration: 31,
        video: null,
        background:
          "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAQDAwQDAwQEBAQFBQQFBwsHBwYGBw4KCggLEA4RERAOEA8SFBoWEhMYEw8QFh8XGBsbHR0dERYgIh8cIhocHRz/2wBDAQUFBQcGBw0HBw0cEhASHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBz/wAARCAAdADIDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAgMEAAEI/8QAGBABAQEBAQAAAAAAAAAAAAAAAAIBERL/xAAXAQEBAQEAAAAAAAAAAAAAAAACAAED/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwDwLOHTAIxTGHIIPAKlVwq8PFqWsL06yac7Gh4zrCtPjVEUknTpopUp9FXrnreF1p6zAXpWjrS9C1rdYLCsf//Z",
        locked: null,
        src: {
          source:
            "https://avnsocial-dev.s3.amazonaws.com/files/2019_12_18/5d/5df/5dfa2c081596a17fb65ff.mp4",
          width: 480,
          height: 270
        },
        preview: {
          source:
            "https://avnsocial-dev.s3.amazonaws.com/files/2019_12_05/5d/5de/5de8d37bbc3a97e9663cb.mp4",
          width: 480,
          height: 270
        },
        thumb: {
          source:
            "https://avnsocial-dev.s3.amazonaws.com/files/1/1e/1e27b0eb09f36fb2d57a570257fc5410/440x440_6490cbc43582eb029d34add601e520bd39801924_preview.jpg",
          width: 440,
          height: 440
        },
        thumbId: 2,
        thumbs: [
          {
            id: 1,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          },
          {
            id: 2,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          },
          {
            id: 3,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          },
          {
            id: 4,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          },
          {
            id: 5,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          }
        ]
      }
    },
    {
      productId: 1179,
      price: 10.5,
      active: true,
      title:
        "123 sodfsdf sfsdfs sdfksjadfls sfsdfsdf sdflksdfs sdfsdf sdfsdfsfs",
      text: "fgdfgdfgfdg",
      maxPrice: "500",
      buyCount: 0,
      author: {
        id: 468788,
        name: "имя",
        username: "user666",
        avatar:
          "https://avnsocial-dev.s3.amazonaws.com/files/i/if/ifz/ifzfcvs2l2uymmy6da7928egvdhnxh4f1575995191/avatar.jpg",
        header:
          "https://avnsocial-dev.s3.amazonaws.com/files/a/aw/awv/awvidf0aytegt7hse0iz8gybr5xhjslv1575995230/w500.jpg",
        headerFull:
          "https://avnsocial-dev.s3.amazonaws.com/files/b/b0/b02/b02ovsj95uucdwr7b0x6efcioajkdfw21575995228/header.jpg",
        canEarn: true,
        deleteRequested: false,
        hideBanking: false,
        publicUrl: "https://avn2.retloko.com/user666",
        hasNotViewedStory: false,
        hasStory: false,
        isVerified: false,
        storeEnabled: true,
        isBlocked: false,
        isMuted: false,
        isSubscribed: true,
        subscribePrice: "10.00",
        canPayoutsRequest: true,
        nominatable: true,
        category: 3,
        categoryView: 1,
        payments: {
          tipsLimit: {
            min: 2,
            max: 500
          }
        }
      },
      media: {
        id: 188,
        canView: false,
        type: "video",
        duration: 31,
        video: null,
        background:
          "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAQDAwQDAwQEBAQFBQQFBwsHBwYGBw4KCggLEA4RERAOEA8SFBoWEhMYEw8QFh8XGBsbHR0dERYgIh8cIhocHRz/2wBDAQUFBQcGBw0HBw0cEhASHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBz/wAARCAAdADIDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAgMEAAEI/8QAGBABAQEBAQAAAAAAAAAAAAAAAAIBERL/xAAXAQEBAQEAAAAAAAAAAAAAAAACAAED/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwDwLOHTAIxTGHIIPAKlVwq8PFqWsL06yac7Gh4zrCtPjVEUknTpopUp9FXrnreF1p6zAXpWjrS9C1rdYLCsf//Z",
        locked: null,
        src: {
          source: null,
          width: 480,
          height: 270
        },
        preview: {
          source:
            "https://avnsocial-dev.s3.amazonaws.com/files/2019_12_18/5d/5df/5dfa2c081596a17fb65ff.mp4",
          width: 480,
          height: 270
        },
        thumb: {
          source:
            "https://avnsocial-dev.s3.amazonaws.com/files/1/1e/1e27b0eb09f36fb2d57a570257fc5410/440x440_6490cbc43582eb029d34add601e520bd39801924_preview.jpg",
          width: 440,
          height: 440
        },
        thumbId: 2,
        thumbs: [
          {
            id: 1,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          },
          {
            id: 2,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          },
          {
            id: 3,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          },
          {
            id: 4,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          },
          {
            id: 5,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          }
        ]
      }
    },
    {
      productId: 1180,
      price: 5.0,
      active: true,
      title:
        "123 sodfsdf sfsdfs sdfksjadfls sfsdfsdf sdflksdfs sdfsdf sdfsdfsfs",
      text: "fgdfgdfgfdg",
      maxPrice: "500",
      buyCount: 0,
      author: {
        id: 468788,
        name: "имя",
        username: "user666",
        avatar:
          "https://avnsocial-dev.s3.amazonaws.com/files/i/if/ifz/ifzfcvs2l2uymmy6da7928egvdhnxh4f1575995191/avatar.jpg",
        header:
          "https://avnsocial-dev.s3.amazonaws.com/files/a/aw/awv/awvidf0aytegt7hse0iz8gybr5xhjslv1575995230/w500.jpg",
        headerFull:
          "https://avnsocial-dev.s3.amazonaws.com/files/b/b0/b02/b02ovsj95uucdwr7b0x6efcioajkdfw21575995228/header.jpg",
        canEarn: true,
        deleteRequested: false,
        hideBanking: false,
        publicUrl: "https://avn2.retloko.com/user666",
        hasNotViewedStory: false,
        hasStory: false,
        isVerified: false,
        storeEnabled: true,
        isBlocked: false,
        isMuted: false,
        isSubscribed: true,
        subscribePrice: "10.00",
        canPayoutsRequest: true,
        nominatable: true,
        category: 3,
        categoryView: 1,
        payments: {
          tipsLimit: {
            min: 2,
            max: 500
          }
        }
      },
      media: {
        id: 189,
        canView: false,
        type: "video",
        duration: 31,
        video: null,
        background:
          "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAQDAwQDAwQEBAQFBQQFBwsHBwYGBw4KCggLEA4RERAOEA8SFBoWEhMYEw8QFh8XGBsbHR0dERYgIh8cIhocHRz/2wBDAQUFBQcGBw0HBw0cEhASHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBz/wAARCAAdADIDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAgMEAAEI/8QAGBABAQEBAQAAAAAAAAAAAAAAAAIBERL/xAAXAQEBAQEAAAAAAAAAAAAAAAACAAED/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwDwLOHTAIxTGHIIPAKlVwq8PFqWsL06yac7Gh4zrCtPjVEUknTpopUp9FXrnreF1p6zAXpWjrS9C1rdYLCsf//Z",
        locked: null,
        src: {
          source: null,
          width: 480,
          height: 270
        },
        preview: {
          source: null,
          width: 480,
          height: 270
        },
        thumb: {
          source:
            "https://avnsocial-dev.s3.amazonaws.com/files/1/1e/1e27b0eb09f36fb2d57a570257fc5410/440x440_6490cbc43582eb029d34add601e520bd39801924_preview.jpg",
          width: 440,
          height: 440
        },
        thumbId: 2,
        thumbs: [
          {
            id: 1,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          },
          {
            id: 2,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          },
          {
            id: 3,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          },
          {
            id: 4,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          },
          {
            id: 5,
            url:
              "https://avnsocial-dev.s3.amazonaws.com/files/7/7f/7fcbcb63520621df408473d15c9528f5/440x440_7d2d7d05568e671ecfddf037cd875a111050266_preview.jpg"
          }
        ]
      }
    }
  ],
  // media: [],
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
            src: {
              ...item.media.src,
              source: data.url
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
    dispatch("_updateMedia", data).then(res => {
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
