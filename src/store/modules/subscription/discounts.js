import { createRequestAction } from "../../utils/storeRequest";
import mockUsers from "@/mock/discountUsers";

const state = {
  users: mockUsers
};

const mutations = {
  setUsers(state, users) {
    state.users = users;
  },
  add(state, user) {
    state.users.push(user);
  },
  remove(state, userId) {
    state.users = state.users.filter(item => item.id !== userId);
  },
  activate(state, data) {
    state.users = state.users.map(item => {
      if (item.id === data.userId) {
        return {
          ...item,
          isActive: true,
          amount: data.amount
        };
      }
      return item;
    });
  },
  disactivate(state, userId) {
    state.users = state.users.map(item => {
      if (item.id === userId) {
        return {
          ...item,
          isActive: false
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
    dispatch("_add", { userId: user.id }).then(() => {
      commit("add", user);
    });
  },
  remove({ dispatch, commit }, userId) {
    dispatch("_remove", userId).then(() => {
      commit("remove", userId);
    });
  },
  toggle({ dispatch, commit }, data) {
    dispatch("_togle", data).then(() => {
      if (data.isActive) {
        commit("activate", data);
      } else {
        commit("disactivate", data.userId);
      }
    });
  }
};

createRequestAction({
  prefix: "_fetchDiscounts",
  apiPath: `users/discounts`,
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  }
});

createRequestAction({
  prefix: "_add",
  apiPath: `users/discounts`,
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
  prefix: "_remove",
  apiPath: `users/discounts/{userId}`,
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
  apiPath: `users/discounts/{userId}`,
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToPath: function(data, path) {
    return path.replace(/{userId}/, data.userId);
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
