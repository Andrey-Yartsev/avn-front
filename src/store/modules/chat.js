"use strict";

import { createRequestAction } from "../utils/storeRequest";

const MESSAGES_LIMIT = 20;
const CHATS_LIMIT = 20;

const state = {
  isSecondScreen: false,
  activeUserId: null,
  windowIsActive: true,
  messagesOffset: 0,
  allMessagesLoaded: true,
  fetchingOld: false,
  // fetch chats
  allDataReceived: false,
  offset: 0,
  chats: []
  //
};

let markAsReadId = 0;

let unreadLastMessage = null;

const _markAsRead = (dispatch, params) => {
  dispatch("markAsRead", params);
};

const markAsRead = (dispatch, params) => {
  clearTimeout(markAsReadId);
  markAsReadId = setTimeout(() => {
    _markAsRead(dispatch, params);
  }, 2000);
};

const actions = {
  blockUser({ commit, dispatch }, userId) {
    dispatch("user/block", userId, { root: true }).then(r => {
      if (r.success) {
        commit("extendChatUser", { id: userId, isBlocked: true });
        commit(
          "search/page/extendUser",
          {
            userId,
            data: { isBlocked: true }
          },
          { root: true }
        );
      }
    });
  },
  unblockUser({ commit, dispatch }, userId) {
    dispatch("user/unblock", userId, { root: true }).then(r => {
      if (r.success) {
        commit("extendChatUser", { id: userId, isBlocked: false });
        commit(
          "search/page/extendUser",
          {
            userId,
            data: { isBlocked: false }
          },
          { root: true }
        );
      }
    });
  },
  muteUser({ commit, dispatch }, { user }) {
    dispatch(`user/mute`, user.id, { root: true }).then(r => {
      if (r.success) {
        commit("extendChatUser", {
          id: user.id,
          isMuted: true
        });
      }
    });
  },
  unmuteUser({ commit, dispatch }, { user }) {
    dispatch(`user/unmute`, user.id, { root: true }).then(r => {
      if (r.success) {
        commit("extendChatUser", {
          id: user.id,
          isMuted: false
        });
      }
    });
  },
  sendMessage({ dispatch }, params) {
    dispatch("_sendMessage", params).then(message => {
      dispatch("updateChatLastMessage", {
        message,
        withUserId: params.userId,
        isMine: true
      });
      const chatExists = state.chats.find(
        chat => chat.withUser.id === params.userId
      );
      if (!chatExists) {
        dispatch("fetchChats");
      }
    });
  },
  newMessage({ state, commit, rootState, dispatch }, message) {
    // const isMine = message.fromUser.id === message.withUser.id;
    const isMine = message.fromUser.id === rootState.auth.user.id;
    //withUser - user to whom chatting
    const withUser = isMine ? message.withUser : message.fromUser;

    // if (
    //   !rootState.auth.user.hasMessages &&
    //   rootState.auth.user.id !== message.fromUser.id
    // ) {
    if (!isMine && !rootState.auth.user.hasMessages) {
      dispatch("auth/extendUser", { hasMessages: true }, { root: true });
    }

    //if new message from another user
    // if (rootState.auth.user.id !== message.fromUser.id) {
    // if (!isMine) {
    //search for existing chat
    const chatFound = state.chats.find(chat => {
      return chat.withUser.id === withUser.id;
    });
    //if chat not found then add new chat
    if (!chatFound) {
      commit("addNewChat", {
        hasHistory: true,
        lastMessage: message,
        mediaCount: message.mediaCount,
        unreadMessageCount: 0,
        id: withUser.id,
        withUser
      });
      // }

      //if chat with user opened already then mark message as read
      if (state.activeUserId === withUser.id) {
        if (!state.windowIsActive) {
          unreadLastMessage = message;
        } else {
          //if (message.fromUser.id) {
          markAsRead(dispatch, {
            // userId: message.fromUser.id,
            userId: withUser.id,
            messageId: message.id
          });
        }
      }
    }

    // const isMine = message.fromUser.id === rootState.auth.user.id;

    // if (isMine) {
    //   withUserId = state.activeUserId;
    // }

    //if there is active chat opened
    if (state.activeUserId) {
      // let withUserId = message.fromUser.id;
      // const isMine = message.fromUser.id === rootState.auth.user.id;

      // if (isMine) {
      //   withUserId = state.activeUserId;
      // }

      const found = state.messages.find(v => v.id === message.id);
      if (found) {
        commit("replaceMessage", message);
      } else {
        if (state.activeUserId === withUser.id) {
          commit("addMessage", message);
        }
      }
    }

    dispatch("updateChatLastMessage", {
      message,
      withUserId: withUser.id,
      isMine
    });

    //if
    // if (!rootState.auth.user.id !== message.fromUser.id) {
    if (!isMine) {
      if (state.activeUserId === withUser.id) {
        dispatch("markChatAsViewed", withUser.id);
      }
    }
  },
  fetchMessages({ dispatch, commit }, activeUserId) {
    commit("fetchingOld", false);
    dispatch("_fetchMessages", activeUserId).then(r => {
      dispatch("markChatAsViewed", activeUserId);
      if (r.list.length >= MESSAGES_LIMIT) {
        commit("allMessagesLoaded", false);
      }
    });
  },
  fetchMessagesDefault({ dispatch, state }) {
    dispatch("_fetchMessages", state.activeUserId).then(() => {
      dispatch("markChatAsViewed", state.activeUserId);
    });
  },
  fetchMoreMessages({ dispatch, commit, state }, userId) {
    commit("fetchingOld", true);
    dispatch("_fetchMoreMessages", { userId }).then(() => {
      if (!state.moreMessages.length) {
        commit("allMessagesLoaded", true);
        return;
      }
      if (state.moreMessages.length < MESSAGES_LIMIT) {
        commit("allMessagesLoaded", true);
      }
      commit("incrementMessagesOffset");
      commit("addOldMessages");
    });
  },
  delete({ dispatch, commit }, userId) {
    dispatch("_delete", userId).then(() => {
      commit("removeChat", userId);
    });
  },
  markChatAsViewed({ commit, dispatch, state, rootState }, userId) {
    commit("markChatAsViewed", userId);

    // if no new messages, change current user hasMessages flag
    let n = 0;
    state.chats.forEach(chat => {
      n += chat.unreadMessagesCount;
    });
    if (n === 0) {
      if (rootState.auth.user.hasMessages) {
        dispatch("auth/extendUser", { hasMessages: false }, { root: true });
      }
    }
  },
  incrementUnreadMessagesCount({ commit }, withUserId) {
    commit("incrementUnreadMessagesCount", withUserId);
  },
  updateChatLastMessage({ commit }, { message, withUserId, isMine }) {
    commit("updateChatLastMessage", {
      message,
      withUserId,
      isMine
    });
  },
  markUnread({ dispatch }) {
    if (!unreadLastMessage) {
      return;
    }
    markAsRead(dispatch, {
      userId: unreadLastMessage.fromUser.id,
      messageId: unreadLastMessage.id
    });
    unreadLastMessage = null;
  }
};

const mutations = {
  setActiveUserId(state, activeUserId) {
    state.activeUserId = activeUserId;
    state.messagesOffset = MESSAGES_LIMIT;
    state.allMessagesLoaded = true;
  },
  allMessagesLoaded(state, allMessagesLoaded) {
    state.allMessagesLoaded = allMessagesLoaded;
  },
  fetchingOld(state, fetchingOld) {
    state.fetchingOld = fetchingOld;
  },
  resetSearchUsers(state) {
    state.chatUsers = null;
  },
  resetChats(state) {
    state.chats = [];
    state.activeUserId = null;
  },
  resetMessages() {
    state.messages = [];
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
      return chat.id !== userId;
    });
  },
  setSecondScreen(state, isSecondScreen) {
    state.isSecondScreen = isSecondScreen;
  },
  incrementUnreadMessagesCount(state, withUserId) {
    let chat = state.chats.filter(chat => chat.withUser.id == withUserId)[0];
    if (chat) {
      chat.unreadMessagesCount++;
    }
  },
  updateChatLastMessage(state, { message, withUserId, isMine }) {
    //Search chat with User from message and update lastMessage
    state.chats = state.chats.map(chat => {
      if (chat.withUser.id === withUserId) {
        chat.lastMessage = message;
        if (!isMine) {
          chat.unreadMessagesCount++;
        }
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
    let found = false;
    const messages = state.messages.map(v => {
      if (v.id === message.id) {
        found = true;
        v = message;
      }
      return v;
    });
    if (!found) {
      state.messages = [...state.messages, message];
    } else {
      state.messages = messages;
    }
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
  },
  addNewChat(state, chat) {
    state.chats = [chat, ...state.chats];
  },
  setActiveWindow(state, isActive) {
    state.windowIsActive = isActive;
  },
  incrementMessagesOffset(state) {
    state.messagesOffset += MESSAGES_LIMIT;
  },
  addOldMessages(state) {
    state.messages = state.moreMessages.concat(state.messages);
  }
};

const fetchChatsInitState = {
  allDataReceived: false,
  offset: 0,
  chats: []
};

mutations.fetchChatsReset = state => {
  for (let k of Object.keys(fetchChatsInitState)) {
    state[k] = fetchChatsInitState[k];
  }
};

mutations.fetchChatsComplete = state => {
  state.chats = [...state.chats, ...state._fetchChatsResult];
  if (state._fetchChatsResult.length < CHATS_LIMIT) {
    state.allDataReceived = true;
  } else {
    state.offset += CHATS_LIMIT;
  }
};

actions.fetchChats = ({ commit, dispatch, state }) => {
  return dispatch("_fetchChats", state.offset).then(response => {
    commit("fetchChatsComplete", response);
  });
};

createRequestAction({
  prefix: "_fetchChats",
  apiPath: "chats",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToOptions: function(params, options) {
    options.query = {
      limit: CHATS_LIMIT,
      offset: params
    };
    return options;
  }
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
    method: "GET",
    query: {}
  },
  resultKey: "messages",
  defaultResultValue: [],
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params);
  },
  resultConvert: function(res, state) {
    if (res.chatsId === state.activeUserId) {
      return Object.values(res.list).reverse();
    }
    return state.messages || [];
  },
  paramsToOptions: function(params, options) {
    options.query.limit = MESSAGES_LIMIT;
    return options;
  }
});

createRequestAction({
  prefix: "_fetchMoreMessages",
  apiPath: "chats/{userId}/messages",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {}
  },
  resultKey: "moreMessages",
  defaultResultValue: [],
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params.userId);
  },
  resultConvert: function(res) {
    return Object.values(res.list).reverse();
  },
  paramsToOptions: function(params, options, state) {
    options.query.offset = state.messagesOffset;
    options.query.limit = MESSAGES_LIMIT;
    return options;
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
  prefix: "sendMultiMessages",
  apiPath: "chats/bulk/messages",
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

createRequestAction({
  prefix: "markAsRead",
  apiPath: "chats/{userId}/messages/{messageId}/view",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToPath: function(params, path) {
    let p = path.replace(/{userId}/, params.userId);
    p = p.replace(/{messageId}/, params.messageId);
    return p;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
