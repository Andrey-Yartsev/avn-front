"use strict";
import PostApi from "@/api/post";
import PostMixin from "@/store/mixins/posts";
import { createRequestAction } from "../../utils/storeRequest";

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

const state = { ...initState, clipCategories: [] };

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
  },
  setTag(state, tagName) {
    state.tag = tagName;
  },
  updateStorePost(state, post) {
    if (state.source === "store" && state.posts.length) {
      state.posts = state.posts.map(item => {
        return item.productId === post.productId ? post : item;
      });
    }
  },
  resetClipCategories(state) {
    state.clipCategories = [];
  }
};

const actions = {
  getPosts({ commit, state, rootState }, data) {
    const filter = (data && data.filter) || undefined;
    const clipCategory = (data && data.clipCategory) || "";
    const { limit, offset, marker } = state;
    let source = state.source;
    if (source === "feed") {
      source = "media";
    }
    commit("postsRequest");

    const category = rootState.gender.category;

    return new Promise(accept => {
      PostApi.getExplorePosts({
        limit,
        offset,
        marker,
        source,
        category,
        filter,
        clipCategory
      })
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

createRequestAction({
  prefix: "getClipCategories",
  apiPath: "posts/clips/categories",
  requestType: "any",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultKey: "clipCategories"
});

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
