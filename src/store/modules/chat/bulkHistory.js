import { createRequestAction } from "@/store/utils/storeRequest";

const fetchLimit = 15;

const state = {
  offset: 0,
  limit: fetchLimit,
  messages: [],
  allDataReceived: false,
  messagesLoading: false
};

const mutations = {
  setLoading(state, value) {
    state.messagesLoading = value;
  },
  addMessages(state, newMessages) {
    state.messages = [...state.messages, ...newMessages];
  },
  isAllDataReceived(state, length) {
    if (length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + state.limit;
    }
  },
  resetData(state) {
    state.messages = [];
    state.offset = 0;
    state.allDataReceived = false;
  },
  updateMessage(state, { messageId, newData }) {
    state.messages = state.messages.map(item => {
      if (item.id === messageId) {
        return {
          ...item,
          ...newData
        };
      }
      return item;
    });
  }
};

const actions = {
  getMessages({ dispatch, commit, state }) {
    commit("setLoading", true);
    return dispatch("_getMessages", {
      offset: state.offset
    }).then(res => {
      commit("setLoading", false);
      commit("addMessages", res.list);
      commit("isAllDataReceived", res.list.length);
    });
  },
  unsendMessage({ dispatch, commit }, messageId) {
    return dispatch("_unsendMessage", messageId).then(() => {
      commit("updateMessage", { messageId, newData: { unsent: true } });
    });
  }
};

createRequestAction({
  prefix: "_getMessages",
  apiPath: "chats/bulk/messages/history",
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
    return options;
  }
});

createRequestAction({
  prefix: "_unsendMessage",
  apiPath: "chats/bulk/messages/history/unsend/{messageId}",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToPath: function(messageId, path) {
    return path.replace(/{messageId}/, messageId);
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
