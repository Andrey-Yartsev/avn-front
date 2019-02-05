"use strict";

import HighlightsApi from "@/api/highlights";
import PostMixin from "@/store/mixins/posts";

const initState = {
  loading: false,
  error: null,
  posts: [],
  allDataReceived: false,
  limit: 10,
  offset: 0,
  marker: "",
  source: ""
};

const state = { ...initState };

const mutations = {
  resetPageState(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  },
  setSource(state, { source }) {
    state.source = source;
  },
  setLimit(state, { limit }) {
    state.limit = limit;
  }
};

const actions = {
  getPosts({ commit }) {
    const { limit, offset, marker, source } = state;
    commit("postsRequest");

    return HighlightsApi.getUserCollections({ limit, offset, marker, source })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("postsRequestSuccess", res);
          });
        }
      })
      .catch(err => {
        commit("postsRequestFail", err);
      });
  },
  setSource({ commit }, { source }) {
    commit("setSource", { source });
  },
  setLimit({ commit }, { limit }) {
    commit("setLimit", { limit });
  },
  addNewStoryToCollection({ commit }, { collectionId, storyId }) {
    return HighlightsApi.getCollection({ collectionId })
      .then(response => {
        if (response.status === 200) {
          return response.json().then(function(res) {
            const storyIds = res.stories.map(el => el.id);
            return HighlightsApi.updateCollection({
              collectionId,
              data: {
                title: res.title,
                storyIds: [...storyIds, storyId]
              }
            });
            // commit("postsRequestSuccess", res);
          });
        }
      })
      .catch(err => {
        commit("addNewStoryToCollectionFail", err);
      });
  }
};

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
