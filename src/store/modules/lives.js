"use strict";
import LivesApi from "@/api/lives";
import PostMixin from "@/store/mixins/posts";
import { createRequestAction } from "../utils/storeRequest";

const initState = {
  loading: false,
  error: null,
  profileLoading: false,
  profileError: null,
  profile: null,
  posts: [],
  allDataReceived: false,
  limit: 10,
  offset: 0,
  marker: "",
  deletedPost: undefined,
  source: "",
  currentLive: {
    amount: 0,
    likesCount: 0,
    looksCount: 0,
    comments: [],
    viewers: [],
    payers: [],
    likers: [],
    statistic: {
      stream_comment_search_all: {
        data: []
      },
      stream_tip_search_all: {
        data: []
      },
      stream_like_search_all: {
        data: []
      },
      stream_look_search_all: {
        data: []
      }
    },
    tipsGoal: {
      description: null,
      amount: null
    }
  }
};

const state = { ...initState };

const mutations = {
  addNewOne(state, live) {
    state.posts = [...state.posts, live];
  },

  addLike(state) {
    state.currentLive.likesCount += 1;
  },

  like(state, like) {
    state.currentLive.likers = [...state.currentLive.likers, like];
  },

  look(state, look) {
    state.currentLive.viewers = [...state.currentLive.viewers, look];

    const prevLook = state.currentLive.comments.filter(comment => {
      const commentUser = comment.user || comment.guest;
      const lookUser = look.user || look.guest;

      return (
        comment.type === "look" &&
        commentUser.id === lookUser.id &&
        Date.now() - comment.canShowAnother < 0
      );
    });

    if (prevLook.length) return;

    state.currentLive.comments = [
      ...state.currentLive.comments,
      {
        ...look,
        type: "look",
        comment: "has joined",
        hideTime: Date.now() + 2 * 60 * 1000,
        canShowAnother: Date.now() + 180 * 1000
      }
    ];
    state.currentLive.looksCount += 1;
  },

  unlook(state, look) {
    state.currentLive.viewers = state.currentLive.viewers.filter(
      viewer => viewer.user.id !== look.user.id
    );
    state.currentLive.looksCount -= 1;
  },

  comment(state, comment) {
    state.currentLive.comments = [
      ...state.currentLive.comments,
      {
        ...comment,
        hideTime: Date.now() + 2 * 60 * 1000
      }
    ];
  },

  goal(state, data) {
    state.currentLive.tipsGoal = {
      description: data.description || null,
      amount: data.amount || null
    };
  },

  tip(state, { tip, who }) {
    state.currentLive.payers = [...state.currentLive.payers, tip];
    state.currentLive.comments = [
      ...state.currentLive.comments,
      {
        ...tip,
        type: "tip",
        comment: `sent ${who} $${tip.amount}`,
        hideTime: Date.now() + 2 * 60 * 1000
      }
    ];
    state.currentLive.amount += tip.amount;
  },

  statistic(state, data) {
    state.currentLive.statistic[data.code] = data;
  },

  removeStream(state, live) {
    state.posts = state.posts.filter(post => {
      return post.id !== live.id;
    });
  },

  resetCurrentLive() {
    state.currentLive = {
      ...initState.currentLive
    };
  },

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
  getPosts({ commit, rootState }) {
    const { limit, offset, marker, source } = state;
    const category = rootState.gender.category;

    commit("postsRequest");

    return LivesApi.getPosts({ limit, offset, marker, source, category })
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
  tip({ commit, rootState }, tip) {
    let who;

    if (rootState.modal.stream.data.stream) {
      const streamer = rootState.modal.stream.data.stream.user;
      who = streamer.name;
    } else {
      who = "you";
    }

    commit("tip", { tip, who });
  }
};

createRequestAction({
  prefix: "block",
  apiPath: "streams/block",
  requestType: "token",
  defaultLoading: true,
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

export default {
  namespaced: true,
  state,
  actions: { ...PostMixin.actions, ...actions },
  mutations: { ...PostMixin.mutations, ...mutations }
};
