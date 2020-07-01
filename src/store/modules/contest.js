"use strict";

import Store from "@/store";
import { createRequestAction } from "@/store/utils/storeRequest";
import settings from "./contest/settings";

const fetchLimit = 12;

const state = {
  categories: [],
  nominees: [],
  prizes: [],
  offset: 0,
  limit: fetchLimit,
  allDataReceived: false
};

const actions = {
  update(context, data) {
    const {
      contestId,
      body: { image, description, twitter }
    } = data;
    return new Promise((accept, reject) => {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("description", description);
      if (twitter) {
        formData.append("twitter", twitter);
      }
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        process.env.VUE_APP_API_URL +
          "/contests/" +
          contestId +
          "/add" +
          "?access-token=" +
          Store.state.auth.token,
        true
      );
      xhr.onload = e => {
        const result = JSON.parse(e.currentTarget.responseText);
        if (result.error) {
          return reject(result.error);
        }
        accept(result);
      };
      xhr.send(formData);
    });
  },
  _vote({ dispatch, commit }, data) {
    return dispatch("vote", data).then(res => {
      if (data.amount === "1") {
        commit("updateFreeVoteValue", data);
      }
      return res;
    });
  },
  _fetchNominees({ dispatch, commit, state }, { contestId }) {
    return dispatch("fetchNominees", {
      offset: state.offset,
      contestId
    }).then(res => {
      commit("addNominees", res);
      commit("isAllNomineesReceived", res.length);
    });
  }
};
const mutations = {
  updateFreeVoteValue(state, data) {
    if (state.nominees.length) {
      state.nominees = state.nominees.map(item => {
        if (item.id === data.nominee) {
          return {
            ...item,
            freeVoteUsed: true
          };
        }
        return item;
      });
    }
  },
  addNominees(state, nominees) {
    state.nominees = [...state.nominees, ...nominees];
  },
  isAllNomineesReceived(state, length) {
    if (length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + state.limit;
    }
  }
};

createRequestAction({
  requestType: "any",
  prefix: "fetchContests",
  apiPath: "contests/list",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  defaultResultValue: []
});

createRequestAction({
  requestType: "any",
  prefix: "fetchNominees",
  apiPath: "contests/nominees/{contestId}",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  defaultResultValue: [],
  paramsToOptions: function(params) {
    const options = {
      method: "GET",
      query: {}
    };
    options.query.offset = params.offset || 0;
    options.query.limit = fetchLimit;
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{contestId}/, params.contestId);
  }
});

createRequestAction({
  prefix: "remove",
  apiPath: "contests/{contestId}/remove/{nomineeId}",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  defaultResultValue: [],
  paramsToPath: function(params, path) {
    let newPath = path.replace(/{contestId}/, params.contestId);
    newPath = newPath.replace(/{nomineeId}/, params.nomineeId);
    return newPath;
  }
});

createRequestAction({
  prefix: "fetchPrizes",
  apiPath: "contests/prizes/{contestId}",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  defaultResultValue: [],
  paramsToPath: function(params, path) {
    return path.replace(/{contestId}/, params.contestId);
  }
});

createRequestAction({
  prefix: "vote",
  apiPath: "contests/vote/{contestId}",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{contestId}/, params.contestId);
  },
  paramsToOptions: function(params, options) {
    options.data = {};
    options.data.nominee = params.nominee;
    options.data.userId = params.userId;
    options.data.paymentType = "vote";
    options.data.votes = params.votes;
    if (params.token) {
      options.data.token = params.token;
    }
    if (window.okev) {
      options.data.sentry = JSON.stringify(window.okev.all());
    }
    return options;
  },
  localError: true,
  throw400: true
});

// createRequestAction({
//   prefix: "update",
//   apiPath: "contests/{contestId}/add",
//   state,
//   mutations,
//   actions,
//   options: {
//     method: "POST"
//   },
//   paramsToPath: function(params, path) {
//     return path.replace(/{contestId}/, params.contestId);
//   },
//   paramsToOptions: function(params, options) {
//     options.body = params.body;
//     options.headers = {
//       "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8"'
//     };
//     return options;
//   },
//   localError: true,
//   throw400: true
// });

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  modules: {
    settings
  }
};
