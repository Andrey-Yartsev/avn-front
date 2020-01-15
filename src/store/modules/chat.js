"use strict";

import { createRequestAction } from "../utils/storeRequest";
import arrayUtils from "../../utils/arrayUtils";

const messagesLimit = 50;
const chatsLimit = 20;

const state = {
  isSecondScreen: false,
  activeUserId: null,
  windowIsActive: true,
  messagesOffset: messagesLimit,
  allMessagesLoaded: true,
  fetchingOld: false,
  // fetch chats
  allDataReceived: false,
  offset: 0,
  chats: [],
  chatsLoading: false,
  moreChatsLoading: false,
  typing: [],
  fontSize: 14,
  blockNewMessagesHandling: false,
  showMarkAsReedForContacts: false,
  unreadChatsCount: 0
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

const typingTimeoutIds = {};

const actions = {
  blockUser({ commit, dispatch }, userId) {
    dispatch("user/block", userId, { root: true }).then(r => {
      if (r.success) {
        commit("extendChatUser", {
          id: userId,
          isBlocked: true,
          followedOn: false,
          subscribedOn: false
        });
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
    dispatch("_sendMessage", params); //.then(message => {
    // unnecessary code
    // lastMessage is updated when message arrives through websocket
    // chats is loaded when chat component is created
    //
    // dispatch("updateChatLastMessage", {
    //   message,
    //   withUserId: params.userId,
    //   isMine: true
    // });
    // const chatExists = state.chats.find(
    //   chat => chat.withUser.id === params.userId
    // );
    // if (!chatExists) {
    //   dispatch("fetchChats");
    // }
    // });
  },
  newMessage({ state, commit, rootState, dispatch }, message) {
    if (state.blockNewMessagesHandling) {
      return;
    }

    const isMine = message.fromUser.id === rootState.auth.user.id;
    // withUser - user to whom chatting
    const withUser = isMine ? message.withUser : message.fromUser;

    if (!isMine && !rootState.auth.user.hasMessages) {
      dispatch("auth/extendUser", { hasMessages: true }, { root: true });
    }

    // search for existing chat
    const chatFound = state.chats.find(chat => {
      return chat.withUser.id === withUser.id;
    });

    // if chat not found then add new chat
    if (!chatFound && state.chats.length) {
      commit("addNewChat", {
        hasHistory: true,
        lastMessage: message,
        mediaCount: message.mediaCount,
        unreadMessagesCount: 0,
        id: withUser.id,
        withUser
      });

      // if chat with user opened already then mark message as read
      if (state.activeUserId === withUser.id) {
        if (!state.windowIsActive) {
          unreadLastMessage = message;
        } else {
          markAsRead(dispatch, {
            userId: withUser.id,
            messageId: message.id
          });
        }
      }
    }

    // if there is active chat opened
    if (state.activeUserId) {
      const found = state.messages.find(v => v.id === message.id);
      if (found) {
        commit("replaceMessage", message);
      } else {
        if (state.activeUserId === withUser.id) {
          commit("addMessage", message);
          // dispatch("markChatAsViewed", withUser.id);
        }
      }
    }

    // if not in chat with user - show toast
    if (!isMine && message.fromUser.id !== state.activeUserId) {
      dispatch(
        "global/flashToast",
        { text: "You have a new message from " + message.fromUser.name },
        {
          root: true
        }
      );
    }

    if (message.isMediaReady) {
      dispatch("updateChatLastMessage", {
        message,
        withUserId: withUser.id,
        isMine
      });
    }

    // if (!isMine) {
    //   if (state.activeUserId === withUser.id) {
    //     dispatch("markChatAsViewed", withUser.id);
    //   }
    // }
  },
  fetchMessages({ state, dispatch, commit }, activeUserId) {
    commit("fetchingOld", false);
    dispatch("_fetchMessages", activeUserId).then(r => {
      const activeChat = state.chats.find(
        chat => chat.withUser.id === activeUserId
      );
      if (activeChat) {
        if (activeChat.unreadMessagesCount) {
          commit("decrementUnreadChatsCount");
        }
      }

      dispatch("updateUnreadMessagesCount", {
        unreadMessagesCount: r.unreadMessagesCount,
        userId: activeUserId
      });
      if (r.list.length >= messagesLimit) {
        commit("allMessagesLoaded", false);
      }
    });
  },
  fetchMessagesDefault({ dispatch, state }) {
    dispatch("_fetchMessages", state.activeUserId).then(() => {
      dispatch("updateHasMessages");
    });
  },
  fetchMoreMessages({ dispatch, commit, state }, userId) {
    commit("fetchingOld", true);
    dispatch("_fetchMoreMessages", { userId }).then(r => {
      dispatch("updateUnreadMessagesCount", {
        unreadMessagesCount: r.unreadMessagesCount,
        userId
      });
      if (!state.moreMessages.length) {
        commit("allMessagesLoaded", true);
        return;
      }
      if (state.moreMessages.length < messagesLimit) {
        commit("allMessagesLoaded", true);
      }
      commit("incrementMessagesOffset", state.moreMessages.length);
      commit("addOldMessages");
    });
  },
  markAllMessagesAsRead({ dispatch }, userId) {
    dispatch("_markAllMessagesAsRead", userId).then(() => {
      dispatch("updateUnreadMessagesCount", {
        unreadMessagesCount: 0,
        userId
      });
    });
  },
  delete({ dispatch, commit }, userId) {
    dispatch("_delete", userId).then(() => {
      commit("removeChat", userId);
    });
  },
  markChatAsViewed({ dispatch }) {
    dispatch("updateHasMessages");
  },
  updateUnreadMessagesCount({ dispatch, commit }, data) {
    commit("updateUnreadMessagesCount", data);
    dispatch("updateHasMessages");
  },
  updateHasMessages({ dispatch, state, rootState }) {
    // if no new messages, change current user hasMessages flag
    const messageCount = state.chats.reduce(
      (sum, chat) => sum + chat.unreadMessagesCount,
      0
    );
    if (messageCount === 0) {
      if (rootState.auth.user.hasMessages) {
        dispatch("auth/extendUser", { hasMessages: false }, { root: true });
      }
    } else {
      // if (!rootState.auth.user.hasMessages) {
      //   dispatch("auth/extendUser", { hasMessages: false }, { root: true });
      // }
    }
  },
  incrementUnreadMessagesCount({ commit }, withUserId) {
    commit("incrementUnreadMessagesCount", withUserId);
  },
  resetUnreadMessagesCount({ commit }, withUserId) {
    commit("resetUnreadMessagesCount", withUserId);
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
  },
  typing({ commit }, id) {
    if (typingTimeoutIds[id]) {
      clearTimeout(typingTimeoutIds[id]);
    }
    commit("setTyping", {
      id,
      isTyping: true
    });
    typingTimeoutIds[id] = setTimeout(() => {
      commit("setTyping", {
        id,
        isTyping: false
      });
    }, 2000);
  },
  markAllChatsAsRead({ dispatch, commit }) {
    dispatch("_markAllChatsAsRead").then(() => {
      commit("unreadChats");
      dispatch("auth/extendUser", { hasMessages: false }, { root: true });
    });
  }
};

const mutations = {
  setActiveUserId(state, activeUserId) {
    state.activeUserId = activeUserId;
    state.messagesOffset = messagesLimit;
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
    if (state.fetchFullActiveUserResult) {
      if (state.fetchFullActiveUserResult.id === user.id) {
        state.fetchFullActiveUserResult = {
          ...state.fetchFullActiveUserResult,
          ...user
        };
      }
    }
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
    state.chats = arrayUtils.modifyByCondition(
      state.chats,
      chat => chat.withUser.id === withUserId,
      chat => chat.unreadMessagesCount++,
      this._vm
    );
  },
  resetUnreadMessagesCount(state, userId) {
    state.chats = arrayUtils.modifyByCondition(
      state.chats,
      chat => chat.withUser.id === userId,
      chat => (chat.unreadMessagesCount = 0),
      this._vm
    );
  },
  updateUnreadMessagesCount(state, { unreadMessagesCount, userId }) {
    state.chats = arrayUtils.modifyByCondition(
      state.chats,
      chat => chat.withUser.id === userId,
      chat => (chat.unreadMessagesCount = unreadMessagesCount),
      this._vm
    );
  },
  updateChatLastMessage(state, { message, withUserId, isMine }) {
    const isMessageFromActiveChat = state.activeUserId === withUserId;
    // Search chat with User from message and update lastMessage
    state.chats = arrayUtils.updateByCondition(
      state.chats,
      chat => chat.withUser.id === withUserId,
      chat => {
        chat.lastMessage = message;
        if (!isMine && !isMessageFromActiveChat) {
          chat.unreadMessagesCount++;
        }
        return chat;
      },
      this._vm
    );
  },
  replaceMessage(state, message) {
    state.messages = arrayUtils.updateByCondition(
      state.messages,
      m => m.id === message.id,
      () => {
        return message;
      },
      this._vm
    );
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
    // state.messages = [...state.messages, message];
    state.messages.push(message);
    state.messagesOffset++;
  },
  addNewChat(state, chat) {
    state.chats = [chat, ...state.chats];
    state.chats = state.chats.slice(0, chatsLimit);
    state.offset++;
  },
  setActiveWindow(state, isActive) {
    state.windowIsActive = isActive;
  },
  incrementMessagesOffset(state, count) {
    state.messagesOffset += count;
  },
  addOldMessages(state) {
    state.messages = state.moreMessages.concat(state.messages);
  },
  // if forceUpdate == true then do chat updating else add chats to existing
  fetchChatsComplete(state, forceUpdate) {
    if (forceUpdate) {
      state.chats = [...state._fetchChatsResult.list];
    } else {
      state.chats = arrayUtils.mergeByCondition(
        state.chats,
        state._fetchChatsResult.list,
        (chat1, chat2) => chat1.id === chat2.id,
        this._vm
      );
    }
    // if visible chats count less unread
    state.showMarkAsReedForContacts =
      state.chats.length < state._fetchChatsResult.unreadMessagesCount;
    state.unreadChatsCount = state._fetchChatsResult.unreadMessagesCount;

    if (state._fetchChatsResult.list.length < chatsLimit) {
      state.allDataReceived = true;
    } else {
      state.offset += chatsLimit;
    }
  },
  setTyping(state, { id, isTyping }) {
    if (isTyping) {
      const exists = state.typing.find(v => id === v);
      if (!exists) {
        state.typing.push(id);
      }
    } else {
      state.typing = state.typing.filter(v => v !== id);
    }
  },
  blockNewMessagesHandling(state, flag) {
    state.blockNewMessagesHandling = flag;
  },
  changeFontSize(state, isBigger) {
    isBigger ? state.fontSize++ : state.fontSize--;
  },
  resetActiveUser(state) {
    state.fetchFullActiveUserResult = null;
  },
  unreadChats(state) {
    state.unreadChatsCount = 0;
    state.chats = state.chats.map(chat => {
      chat.unreadMessagesCount = 0;
      return chat;
    });
  },
  decrementUnreadChatsCount(state) {
    state.unreadChatsCount--;
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

mutations.chatsLoading = (state, flag) => {
  state.chatsLoading = flag;
};

mutations.moreChatsLoading = (state, flag) => {
  state.moreChatsLoading = flag;
};

actions.fetchChats = ({ commit, dispatch, state }, forceUpdate) => {
  if (forceUpdate) {
    commit("chatsLoading", true);
  } else {
    commit("moreChatsLoading", true);
  }
  return dispatch("_fetchChats", state.offset).then(() => {
    commit("fetchChatsComplete", forceUpdate);
    if (forceUpdate) {
      commit("chatsLoading", false);
    } else {
      commit("moreChatsLoading", false);
    }
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
      limit: chatsLimit,
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
    params.limit = chatsLimit;
    options.query = { ...options.query, ...params };
    return options;
  },
  resultConvert: function(res) {
    return res.list;
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
    options.query.limit = messagesLimit;
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
    options.query.limit = messagesLimit;
    return options;
  }
});

createRequestAction({
  prefix: "fetchLastMessage",
  apiPath: "chats/{userId}/last-messages",
  state,
  mutations,
  actions,
  options: {
    method: "GET",
    query: {}
  },
  defaultResultValue: [],
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params);
  },
  resultConvert: function(res) {
    if (res.list && res.list.length > 0) {
      return res.list[0];
    }
    return null;
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
  prefix: "sendGroupMessage",
  apiPath: "chats/recipients/messages",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  localError: true,
  throw400: true,
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
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

createRequestAction({
  prefix: "fetchFullActiveUser",
  apiPath: "users/{username}",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{username}/, params);
  }
});

createRequestAction({
  prefix: "_markAllMessagesAsRead",
  apiPath: "chats/{userId}/messages-read",
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
  prefix: "fetchAllUsersCount",
  apiPath: "chats/bulk-count-all",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "_markAllChatsAsRead",
  apiPath: "chats/messages-read",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
