import { createRequestAction } from "../../utils/storeRequest";

const state = {
  users: []
};

const mutations = {
  setUsers(state, users) {
    state.users = users;
  },
  add(state, user) {
    state.users.push(user);
  },
  remove(state, userId) {
    state.users = state.users.filter(item => item.user.id !== userId);
  },
  activate(state, data) {
    state.users = state.users.map(item => {
      if (item.user.id === data.user.id) {
        return {
          user: { ...item.user },
          isActive: true,
          amount: data.amount,
          months: data.months,
          expiredDate: data.expiredDate
        };
      }
      return item;
    });
  },
  disactivate(state, userId) {
    state.users = state.users.map(item => {
      if (item.user.id === userId) {
        return {
          ...item,
          user: { ...item.user },
          isActive: false,
          expiredDate: null
        };
      }
      return item;
    });
  }
};

const actions = {
  fetchDiscounts({ dispatch, commit }) {
    dispatch("_fetchDiscounts").then(res => {
      commit("setUsers", res);
    });
  },
  add({ dispatch, commit }, user) {
    dispatch("_add", { userId: user.id }).then(res => {
      commit("add", res.data);
    });
  },
  remove({ dispatch, commit }, userId) {
    dispatch("_remove", userId).then(() => {
      commit("remove", userId);
    });
  },
  toggle({ dispatch, commit }, data) {
    dispatch("_togle", data).then(res => {
      if (data.isActive) {
        commit("activate", res.data);
      } else {
        commit("disactivate", res.data.user.id);
      }
    });
  }
};

createRequestAction({
  prefix: "_fetchDiscounts",
  apiPath: `discounts/users`,
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "_add",
  apiPath: `discounts/users`,
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
  prefix: "_remove",
  apiPath: `discounts/users/{userId}`,
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(userId, path) {
    return path.replace(/{userId}/, userId);
  }
});

createRequestAction({
  prefix: "_togle",
  apiPath: `discounts/users/{userId}`,
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToPath: function(data, path) {
    return path.replace(/{userId}/, data.user.id);
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
