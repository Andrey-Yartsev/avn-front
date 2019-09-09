"use strict";
import PostApi from "@/api/post";
import PostMixin from "@/store/mixins/posts";
import gender from "./gender";

const initState = {
  loading: false,
  error: null,
  posts: [],
  allDataReceived: false,
  limit: 12,
  offset: 0,
  marker: "",
  source: "media",
  deletedPost: undefined,
  category: null
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
  setCategory(state, category) {
    state.category = category;
  }
};

const actions = {
  getPosts({ commit, state, rootState }) {
    const { limit, offset, marker } = state;
    let source = state.source;
    if (source === "feed") {
      source = "media";
    }
    commit("postsRequest");

    const category = rootState.explore.gender.category;

    return new Promise(accept => {
      PostApi.getExplorePosts({ limit, offset, marker, source, category })
        .then(response => {
          if (response.status === 200) {
            response.json().then(function(res) {
              commit("postsRequestSuccess", res);
              accept(res);
            });
          }
        })
        .catch(err => {
          commit("postsRequestFail", err);
        });
    });
  },
  setSource({ commit }, { source }) {
    commit("setSource", { source });
  }
};

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations },
  modules: {
    gender
  }
};
