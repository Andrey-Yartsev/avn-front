import { createRequestAction } from "../utils/storeRequest";

const state = {};

const actions = {
  restoreAccount({ dispatch }) {
    return dispatch("update", {
      deleteRequested: false
    });
  },
  follow({ commit, dispatch }, userId) {
    return dispatch("_follow", userId).then(res => {
      commit(
        "auth/addItemToUserConnectedData",
        { key: "follow", id: userId },
        { root: true }
      );
      return res;
    });
  },
  unfollow({ commit, dispatch }, userId) {
    return dispatch("_unfollow", userId).then(res => {
      commit(
        "auth/removeItemFromUserConnectedData",
        { key: "follow", id: userId },
        { root: true }
      );
      return res;
    });
  }
};

const mutations = {};

createRequestAction({
  prefix: "block",
  apiPath: "users/{userId}/block",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  resultKey: "block",
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params);
  }
});

createRequestAction({
  prefix: "unblock",
  apiPath: "users/{userId}/block",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  resultKey: "unblock",
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params);
  }
});

createRequestAction({
  prefix: "mute",
  apiPath: "users/{userId}/mute",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  resultKey: "mute",
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params);
  }
});

createRequestAction({
  prefix: "unmute",
  apiPath: "users/{userId}/mute",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  resultKey: "unmute",
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params);
  }
});

createRequestAction({
  prefix: "report",
  apiPath: "users/{userId}/report",
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
    return path.replace(/{userId}/, params.userId);
  }
});

createRequestAction({
  prefix: "_follow",
  apiPath: "subscriptions/follow",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = {
      userId: params
    };
    return options;
  }
});

createRequestAction({
  prefix: "_unfollow",
  apiPath: "subscriptions/unfollow",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToOptions: function(params, options) {
    options.data = {
      userId: params
    };
    return options;
  }
});

createRequestAction({
  prefix: "changePassword",
  apiPath: "users/change-password",
  state,
  mutations,
  actions,
  localError: true,
  throw400: true,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

createRequestAction({
  prefix: "_deleteAccount",
  apiPath: `users/me`,
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  throw400: true,
  localError: true,
  paramsToPath: function(params, path) {
    return path.replace(/{token}/, params);
  }
});

createRequestAction({
  prefix: "update",
  apiPath: "users/me",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
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
      type: "user"
    }
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
