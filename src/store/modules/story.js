"use strict";

import StoriesApi from "@/api/stories";
import router from "@/router";
import ws from "@/ws";

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

          ws.send({
            act: "collect",
            message: "story_added",
            data: {
              story_id: newPost[0].id,
              story_user_id: newPost[0].user.id,
              owner: newPost[0].user.id
            }
          });

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
  watch(opt, { postId }) {
    return StoriesApi.watchStory({ postId });
  },
  saveCollection({ commit }, { data }) {
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
