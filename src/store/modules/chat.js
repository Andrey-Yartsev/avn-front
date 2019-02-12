"use strict";

import { createRequestAction } from "../utils/storeRequest";

const state = {
  isSecondScreen: false,
  activeUserId: null
};

const actions = {
  blockUser({ commit, dispatch }, userId) {
    dispatch("user/block", userId, { root: true }).then(r => {
      if (r.success) {
        commit("extendChatUser", { id: userId, isBlocked: true });
      }
    });
  },
  unblockUser({ commit, dispatch }, userId) {
    dispatch("user/unblock", userId, { root: true }).then(r => {
      if (r.success) {
        commit("extendChatUser", { id: userId, isBlocked: false });
      }
    });
  },
  muteUser({ commit, dispatch }, userId) {
    dispatch("user/mute", userId, { root: true }).then(r => {
      if (r.success) {
        commit("extendChatUser", { id: userId, isMuted: true });
      }
    });
  },
  unmuteUser({ commit, dispatch }, userId) {
    dispatch("user/unmute", userId, { root: true }).then(r => {
      if (r.success) {
        commit("extendChatUser", { id: userId, isMuted: false });
      }
    });
  },
  sendMessage({ commit, dispatch }, params) {
    dispatch("_sendMessage", params).then(message => {
      commit("updateChatLastMessage", {
        message,
        fromUserId: params.userId
      });
      const chatExists = state.chats.find(
        chat => chat.withUser.id === params.userId
      );
      if (!chatExists) {
        dispatch("fetchChats");
      }
    });
  },
  newMessage({ state, commit }, message) {
    const found = state.messages.find(v => v.id === message.id);
    if (found) {
      commit("replaceMessage", message);
    } else {
      if (state.activeUserId === message.fromUser.id) {
        commit("addMessage", message);
        commit("updateChatLastMessage", {
          message,
          fromUserId: message.fromUser.id
        });
      } else {
        commit("updateChatLastMessage", {
          message,
          fromUserId: message.fromUser.id
        });
      }
    }
  },
  fetchMessages({ dispatch, commit }, activeUserId) {
    dispatch("_fetchMessages", activeUserId).then(() => {
      commit("markChatAsViewed", activeUserId);
    });
  },
  fetchMessagesDefault({ dispatch, commit, state }) {
    dispatch("_fetchMessages", state.activeUserId).then(() => {
      commit("markChatAsViewed", state.activeUserId);
    });
  },
  delete({ dispatch, commit }, userId) {
    dispatch("_delete", userId).then(() => {
      commit("removeChat", userId);
    });
  }
};

const mutations = {
  setActiveUserId(state, activeUserId) {
    state.activeUserId = activeUserId;
  },
  resetSearchUsers(state) {
    state.chatUsers = null;
  },
  resetChats() {
    state.chats = [];
  },
  extendChatUser(state, user) {
    state.chats = state.chats.map(v => {
      if (v.withUser.id === user.id) {
        v.withUser = { ...v.withUser, ...user };
      }
      return v;
    });
  },
  removeChat(state, userId) {
    state.chats = state.chats.filter(chat => {
      return chat.withUser.id !== userId;
    });
  },
  setSecondScreen(state, isSecondScreen) {
    state.isSecondScreen = isSecondScreen;
  },
  updateChatLastMessage(state, { message, fromUserId }) {
    state.chats = state.chats.map(chat => {
      if (chat.withUser.id === fromUserId) {
        chat.lastMessage = message;
        chat.unreadMessagesCount++;
      }
      return chat;
    });
  },
  markChatAsViewed(state, userId) {
    state.chats = state.chats.map(chat => {
      if (chat.withUser.id === userId) {
        chat.unreadMessagesCount = 0;
      }
      return chat;
    });
  },
  replaceMessage(state, message) {
    state.messages = state.messages.map(v => {
      if (v.id === message.id) {
        v = message;
      }
      return v;
    });
  },
  extendMessage(state, { id, data }) {
    state.messages = state.messages.map(v => {
      if (v.id === id) {
        v = { ...v, data };
      }
      return v;
    });
  },
  addMessage(state, message) {
    state.messages = [...state.messages, message];
  }
};

createRequestAction({
  prefix: "fetchChats",
  apiPath: "chats",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultKey: "chats",
  defaultResultValue: []
});

createRequestAction({
  prefix: "fetchAnyChats",
  apiPath: "chats",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {
      withoutHistory: true
    }
  },
  resultKey: "anyChats",
  defaultResultValue: [],
  paramsToOptions: function(params, options) {
    options.query = { query: params };
    return options;
  }
});

createRequestAction({
  prefix: "searchUsers",
  apiPath: "chats/users",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultKey: "chatUsers",
  paramsToOptions: function(params, options) {
    options.query = { query: params };
    return options;
  }
});

createRequestAction({
  prefix: "_fetchMessages",
  apiPath: "chats/{userId}/messages",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  resultKey: "messages",
  defaultResultValue: [],
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params);
  },
  resultConvert: function(messages) {
    return Object.values(messages).reverse();
  }
});

createRequestAction({
  prefix: "_sendMessage",
  apiPath: "chats/{userId}/messages",
  state,
  mutations,
  actions,
  resultKey: "messages",
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params.data;
    return options;
  },
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params.userId);
  },
  resultConvert: function(message, state) {
    let found = false;
    let messages = state.messages.map(v => {
      if (v.id === message.id) {
        v = message;
        found = true;
      }
      return v;
    });
    if (!found) {
      messages = [...state.messages, message];
    }

    return messages;
  }
});

createRequestAction({
  prefix: "_delete",
  apiPath: "chats/{userId}",
  state,
  mutations,
  actions,
  resultKey: "messages",
  options: {
    method: "DELETE"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params);
  },
  resultConvert: function() {
    return [];
  }
});

createRequestAction({
  prefix: "fetchActiveUser",
  apiPath: "users/{userId}",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
