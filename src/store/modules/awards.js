"use strict";

import { createRequestAction } from "@/store/utils/storeRequest";

const limit = 75;

const state = {
  votesCount: 0,
  nominees: [],
  voting: false
};

const actions = {
  fetchNominees({ dispatch, state, commit }, params) {
    params.query = {
      offset: state.offset,
      limit
    };
    return new Promise(accept => {
      dispatch("_fetchNominees", params).then(result => {
        commit("setNominees", result);
        accept(result);
      });
    });
  },
  vote({ dispatch, commit }, data) {
    return new Promise((accept, reject) => {
      return dispatch("_vote", data)
        .then(result => {
          commit("setNomineeVoted", {
            id: data.id,
            isVoted: true
          });
          commit("incrementVotesCount");
          commit("updateVoteId", {
            id: data.id,
            voteId: result.voteId
          });
          accept(result);
        })
        .catch(err => {
          reject(err);
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
        commit("updateVoteId", {
          id: data.id,
          voteId: null
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
  setNominees(state, result) {
    state.nominees = result.list;
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
    state.votesCount = 0;
    state.nominees = [];
  },
  updateVoteId(state, { id, voteId }) {
    state.nominees = state.nominees.map(v => {
      if (v.nomineeId === id) {
        v.voteId = voteId;
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
  prefix: "fetchNominated",
  requestType: "any",
  apiPath: "ballot/nominated/{eventId}",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{eventId}/, params);
  }
});

createRequestAction({
  prefix: "_fetchCategories",
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
  throw400: true,
  paramsToOptions: function(params, options) {
    options.data = {
      nominee: params.id,
      sentry: params.sentry
    };
    return options;
  },
  paramsToPath: function(params, path) {
    let r = path.replace(/{eventId}/, params.eventId);
    return r.replace(/{categoryId}/, params.categoryId);
  }
});

createRequestAction({
  prefix: "_unvote",
  apiPath: "ballot/vote/{eventId}/{categoryId}/{nomineeId}/{voteId}",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToOptions: function(params, options) {
    options.data = { sentry: params.sentry };
    return options;
  },
  paramsToPath: function(params, path) {
    let r = path.replace(/{eventId}/, params.eventId);
    r = r.replace(/{nomineeId}/, params.id);
    r = r.replace(/{voteId}/, params.voteId);
    return r.replace(/{categoryId}/, params.categoryId);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
