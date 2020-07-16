import { createRequestAction } from "../../utils/storeRequest";
import mockedGroups from "../../../mock/groups";

const fetchLimit = 9;

const initState = {
  groups: mockedGroups,
  // groups: [],
  marker: null,
  offset: 0,
  limit: fetchLimit,
  allDataReceived: false
};

const state = { ...initState };

const mutations = {
  addGroups(state, newGroups) {
    if (state.groups.length) {
      const filteredGroups = newGroups.filter(item => {
        const existedItem = state.groups.find(
          groups => groups.productId === item.productId
        );
        return existedItem ? false : true;
      });
      state.groups = [...state.groups, ...filteredGroups];
    } else {
      state.groups = [...newGroups];
    }
  },
  clearGroups(state) {
    state.groups = [];
    state.offset = 0;
    state.allDataReceived = false;
  },
  addGroup(state, newListItem) {
    state.groups = [newListItem, ...state.groups];
    state.offset++;
  },
  updateGroup(state, updatedListItem) {
    state.groups = state.groups.map(item => {
      return item.productId === updatedListItem.productId
        ? updatedListItem
        : item;
    });
  },
  deleteGroup(state, productId) {
    state.groups = state.groups.filter(item => item.productId !== productId);
    state.offset--;
  },
  isAllDataRecieved(state, length) {
    if (length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + state.limit;
    }
  },
  joinGroup(state, productId) {
    state.groups = state.groups.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          isMember: true
        };
      }
      return item;
    });
  },
  leaveGroup(state, productId) {
    state.groups = state.groups.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          isMember: false
        };
      }
      return item;
    });
  }
};

const actions = {
  getGroups({ dispatch, commit, state }, { filter, profileId }) {
    return dispatch("_getGroups", {
      profileId,
      filter,
      offset: state.offset
    }).then(res => {
      commit("addGroups", res);
      commit("isAllDataRecieved", res.length);
      return res;
    });
  },
  addGroup({ dispatch, commit }, data) {
    return dispatch("_addGroup", data).then(res => {
      commit("addGroup", res);
      dispatch(
        "global/flashToast",
        { text: "New group successfully added" },
        {
          root: true
        }
      );
      commit(
        "auth/incrementGroupsCount",
        { label: res.title, key: res.productId },
        { root: true }
      );
      return res;
    });
  },
  updateGroup({ dispatch, commit }, data) {
    return dispatch("_updateGroup", data).then(res => {
      commit("updateGroup", res);
      dispatch(
        "global/flashToast",
        {
          text: "Group successfully updated"
        },
        { root: true }
      );
      commit(
        "auth/updateGroupsCount",
        { label: res.title, key: res.productId },
        { root: true }
      );
      return res;
    });
  },
  deleteGroup({ dispatch, commit }, productId) {
    dispatch("_deleteGroup", productId).then(() => {
      commit("deleteGroup", productId);
      dispatch(
        "global/flashToast",
        { text: "Group deleted successfully" },
        {
          root: true
        }
      );
      commit("auth/decrementGroupsCount", productId, { root: true });
    });
  },
  addMember({ dispatch }, userId) {
    return dispatch("_addMember", userId).then(res => {
      dispatch("global/flashToast", {
        text: "Members list updated"
      });
      return res;
    });
  },
  removeMember({ dispatch }, userId) {
    return dispatch("_removeMember", userId).then(res => {
      dispatch("global/flashToast", {
        text: "Members list updated"
      });
      return res;
    });
  },
  joinGroup({ dispatch, commit }, { productId }) {
    dispatch("_joinGroup", productId).then(() => {
      commit("joinGroup", productId);
    });
  },
  leaveGroup({ dispatch, commit }, productId) {
    dispatch("_leaveGroup", productId).then(() => {
      commit("leaveGroup", productId);
    });
  },
  sendMessage({ dispatch }, data) {
    return dispatch("_sendMessage", data);
  },
  getScheduleMessages({ dispatch }, groupId) {
    return dispatch("_getScheduleMessages", { groupId });
  },
  deleteScheduleMessage({ dispatch }, data) {
    return dispatch("_deleteScheduleMessage", data);
  }
};

createRequestAction({
  requestType: "any",
  prefix: "_getGroups",
  apiPath: "groups/{userId}",
  state,
  mutations,
  actions,
  paramsToOptions: function(params) {
    const options = {
      method: "GET",
      query: {}
    };
    options.query.offset = params.offset || 0;
    options.query.limit = fetchLimit;
    options.query.filter = params.filter;
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params.profileId);
  }
});

createRequestAction({
  prefix: "_addGroup",
  apiPath: "groups/",
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
  prefix: "_updateGroup",
  apiPath: "groups/{productId}",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToPath: function(data, path) {
    return path.replace(/{productId}/, data.productId);
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

createRequestAction({
  prefix: "_sendMessage",
  apiPath: "chats/recipients/messages",
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
  prefix: "_getScheduleMessages",
  apiPath: "chats/recipients/messages/queue",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToOptions: function(params) {
    const options = {
      method: "GET",
      query: {}
    };
    options.query.type = "groups";
    options.query.id = params.groupId;
    return options;
  }
});

createRequestAction({
  prefix: "_deleteScheduleMessage",
  apiPath: "chats/recipients/messages/queue/{messageId}",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(data, path) {
    return path.replace(/{messageId}/, data.messageId);
  }
});

createRequestAction({
  prefix: "_deleteGroup",
  apiPath: "groups/{productId}",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(productId, path) {
    return path.replace(/{productId}/, productId);
  }
});

// createRequestAction({
//   prefix: "_addMember",
//   apiPath: "groups/{productId}/members",
//   state,
//   mutations,
//   actions,
//   options: {
//     method: "PUT"
//   },
//   paramsToPath: function(params, path) {
//     return path.replace(/{productId}/, params.productId);
//   },
//   paramsToOptions: function(params, options) {
//     options.userId = params.userId;
//     return options;
//   }
// });

// createRequestAction({
//   prefix: "_removeMember",
//   apiPath: "groups/{productId}/members/{userId}",
//   state,
//   mutations,
//   actions,
//   options: {
//     method: "DELETE"
//   },
//   paramsToPath: function(params, path) {
//     let newPath;
//     newPath = path.replace(/{productId}/, params.productId);
//     newPath = path.replace(/{userId}/, params.userId);
//     return newPath;
//   },
//   paramsToOptions: function(params, options) {
//     options.userId = params.userId;
//     return options;
//   }
// });

createRequestAction({
  prefix: "_joinGroup",
  apiPath: "groups/{productId}/join",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToPath: function(productId, path) {
    return path.replace(/{productId}/, productId);
  }
});

createRequestAction({
  prefix: "_leaveGroup",
  apiPath: "groups/{productId}/join",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(productId, path) {
    return path.replace(/{productId}/, productId);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
