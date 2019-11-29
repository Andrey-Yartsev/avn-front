"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const limit = 10;

const state = {
  offset: 0,
  allDataReceived: false
};

const actions = {
  fetchNominees({ dispatch, state, commit }, params) {
    params.query = {
      offset: state.offset,
      limit
    };
    return new Promise(accept => {
      dispatch("_fetchNominees", params).then(list => {
        commit("checkResult", { list });
        accept(list);
      });
    });
  },
  vote({ dispatch, commit }, data) {
    return new Promise(accept => {
      dispatch("_vote", data).then(result => {
        commit("setNomineeVoted", {
          id: data.id,
          isVoted: true
        });
        accept(result);
      });
    });
  },
  unvote({ dispatch, commit }, data) {
    return new Promise(accept => {
      dispatch("_unvote", data).then(result => {
        commit("setNomineeVoted", {
          id: data.id,
          isVoted: false
        });
        accept(result);
      });
    });
  }
};

const mutations = {
  reset(state) {
    state.searchResult = [];
  },
  saveData(state, payload) {
    state.savedData = payload;
  },
  clearSavedData() {
    state.savedData = null;
  },
  checkResult(state, { list }) {
    if (list.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + limit;
    }
    // state.marker = marker;
  },
  setNomineeVoted(state, { id, isVoted }) {
    state.nominees = state.nominees.map(v => {
      if (v.nomineeId === id) {
        v.isVoted = isVoted;
      }
      return v;
    });
  }
};

createRequestAction({
  prefix: "fetchCategories",
  requestType: "any",
  apiPath: "ballot/categories/{eventId}",
  state,
  mutations,
  actions,
  resultKey: "categories",
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{eventId}/, params);
  }
});

createRequestAction({
  prefix: "nominate",
  apiPath: "ballot/nominate/{eventId}",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{eventId}/, params.eventId);
  },
  paramsToOptions: function(params, options) {
    options.data = params.data;
    return options;
  }
});

createRequestAction({
  prefix: "search",
  apiPath: "search/users",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  defaultResultValue: [],
  paramsToOptions: function(params, options) {
    if (!params.offset) {
      params.offset = 0;
    }
    if (!params.limit) {
      params.limit = 5;
    }
    options.query = params;
    return options;
  },
  resultConvert: function(res) {
    return res.list || [];
  }
});

createRequestAction({
  prefix: "fetchUser",
  apiPath: "users/{username}",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{username}/, params);
  },
  localError: true,
  requestType: "no-token"
});

createRequestAction({
  prefix: "_fetchNominees",
  apiPath: "ballot/nominees/{eventId}/{categoryId}",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  defaultResultValue: [],
  resultKey: "nominees",
  paramsToOptions: function(params, options) {
    options.query = params.query;
    return options;
  },
  paramsToPath: function(params, path) {
    let r = path.replace(/{eventId}/, params.eventId);
    return r.replace(/{categoryId}/, params.categoryId);
  },
  resultConvert: function(result, state) {
    return [...state.nominees, ...result];
  }
});

createRequestAction({
  prefix: "_vote",
  apiPath: "ballot/vote/{eventId}/{categoryId}",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = { nominee: params.id };
    return options;
  },
  paramsToPath: function(params, path) {
    let r = path.replace(/{eventId}/, params.eventId);
    return r.replace(/{categoryId}/, params.categoryId);
  }
});

createRequestAction({
  prefix: "_unvote",
  apiPath: "ballot/vote/{eventId}/{categoryId}/{nomineeId}",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(params, path) {
    let r = path.replace(/{eventId}/, params.eventId);
    r = r.replace(/{nomineeId}/, params.id);
    return r.replace(/{categoryId}/, params.categoryId);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
