"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const limit = 50;

const state = {
  offset: 0,
  allDataReceived: false,
  votesCount: 0,
  nominees: []
};

const actions = {
  fetchNominees({ dispatch, state, commit }, params) {
    params.query = {
      offset: state.offset,
      limit
    };
    return new Promise(accept => {
      dispatch("_fetchNominees", params).then(result => {
        commit("prepareNomineesResult", result);
        accept(result);
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
        commit("incrementVotesCount");
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
        commit("decrementVotesCount");
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
  prepareNomineesResult(state, result) {
    if (result.list.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + limit;
    }
    state.nominees = [...state.nominees, ...result.list];
    state.votesCount = result.votesCount;
  },
  setNomineeVoted(state, { id, isVoted }) {
    state.nominees = state.nominees.map(v => {
      if (v.nomineeId === id) {
        v.isVoted = isVoted;
      }
      return v;
    });
  },
  incrementVotesCount(state) {
    state.votesCount++;
  },
  decrementVotesCount(state) {
    state.votesCount--;
  },
  resetNominees(state) {
    state.offset = 0;
    state.allDataReceived = false;
    state.votesCount = 0;
    state.nominees = [];
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
  requestType: "any",
  paramsToOptions: function(params, options) {
    options.query = params.query;
    return options;
  },
  paramsToPath: function(params, path) {
    let r = path.replace(/{eventId}/, params.eventId);
    return r.replace(/{categoryId}/, params.categoryId);
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
