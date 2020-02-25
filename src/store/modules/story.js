"use strict";

import StoriesApi from "@/api/stories";
import router from "@/router";

const initState = {
  newPost: undefined,
  deletedPost: undefined,
  newCollection: undefined
};

const state = { ...initState };

const mutations = {
  resetPageState(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  },

  deletePost(state, data) {
    state.deletedPost = data;
  },

  savePostSuccess(state, data) {
    state.newPost = data;
  },

  saveCollectionSuccess(state, data) {
    state.newCollection = data;
  }
};

const actions = {
  savePost({ commit }, { data, userId }) {
    return StoriesApi.savePost(data)
      .then(async response => {
        if (response.status === 200) {
          const url = `/stories/${userId}`;
          const newPost = await response.json();
          commit("savePostSuccess", newPost);

          if (router.history.current.fullPath !== url) {
            router.push(url);
          }
        }
      })
      .catch(() => {});
  },
  deletePost({ commit }, { postId }) {
    return StoriesApi.deletePost({ postId })
      .then(response => {
        if (response.status === 200) {
          commit("deletePost", {
            postId
          });
        }
      })
      .catch(() => {});
  },
  removePost({ commit }, { authorId }) {
    commit("stories/explore/removePost", authorId, { root: true });
    commit("stories/feed/removePost", authorId, { root: true });
    commit("stories/page/removePost", authorId, { root: true });
  },
  watch(opt, { postId }) {
    return StoriesApi.watchStory({ postId });
  },
  redirectByStoryLink(opt, { postId }) {
    return StoriesApi.redirectStory({ postId });
  },
  saveCollection({ commit }, data) {
    return StoriesApi.saveCollection(data)
      .then(async response => {
        if (response.status === 200) {
          const newPost = await response.json();
          commit("saveCollectionSuccess", newPost);
        }
      })
      .catch(() => {});
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
