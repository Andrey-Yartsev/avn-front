"use strict";

import PostApi from "@/api/post";
import { createRequestAction } from "../utils/storeRequest";
import { logDebug } from "@/utils/logging";

const state = {
  currentPost: undefined,
  reportedPost: undefined,
  postReportReasons: [],
  newPost: undefined,
  updatedPost: undefined
};
const mutations = {
  setCurrentPost(state, { postData }) {
    state.currentPost = postData;
  },

  reloadPostSuccess(state, data) {
    state.updatedPost = data;
  }
};

const actions = {
  async createPost({ dispatch, commit }, data) {
    logDebug({
      logger: "Post",
      message: "Create",
      logData: data
    });
    const result = await dispatch("_createPost", data);
    logDebug({
      logger: "Post",
      message: "Created",
      logData: {
        result
      }
    });
    commit("modal/hide", { name: "addPost" }, { root: true });
    return result;
  },

  reloadPost({ commit }, { postId }) {
    return PostApi.getPost({ postId })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(post) {
            commit("reloadPostSuccess", post);
          });
        }
      })
      .catch(err => {
        commit("postsRequestFail", err);
      });
  }
};

createRequestAction({
  prefix: "_createPost",
  apiPath: "posts",
  resultKey: "newPost",
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
  prefix: "updatePost",
  apiPath: "posts/{id}",
  resultKey: "newPost",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToOptions: function(params, options) {
    options.data = params.data;
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{id}/, params.postId);
  }
});

createRequestAction({
  prefix: "fetchStreamEvents",
  apiPath: "streams/{streamId}/info",
  state,
  mutations,
  actions,
  requestType: "any",
  defaultResultValue: [],
  localError: true,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{streamId}/, params);
  }
});

createRequestAction({
  prefix: "fetchReportReasons",
  apiPath: "reports/reasons",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {
      type: "post"
    }
  }
});

createRequestAction({
  prefix: "report",
  apiPath: "posts/{postId}/report",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = {
      reasonId: params.reasonId
    };
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{postId}/, params.postId);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
