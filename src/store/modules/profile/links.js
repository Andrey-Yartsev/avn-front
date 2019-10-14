import UserApi from "@/api/user";

const initState = {
  loading: false,
  error: null,
  links: [],
  editedLink: null
};

const state = { ...initState };

const mutations = {
  startLoading(state) {
    state.loading = true;
  },
  endLoading(state) {
    state.loading = false;
  },
  setLinks(state, payload) {
    state.links = payload;
  },
  setError(state, message) {
    state.error = message;
  },
  clearError(state) {
    state.error = null;
  },
  addLink(state, payload) {
    payload.pinned ? state.links.unshift(payload) : state.links.push(payload);
  },
  startEditLink(state, payload) {
    state.editedLink = payload;
  },
  endEditLink(state) {
    state.editedLink = null;
  },
  updateLink(state, payload) {
    state.links = state.links.map(item =>
      item.id === payload.id ? payload : item
    );
  },
  deleteLink(state, id) {
    state.links = state.links.filter(item => item.id !== id);
  },
  clearLinks(state) {
    state.links = [];
  }
};

const actions = {
  getLinks({ commit }, userId) {
    commit("clearError");
    commit("startLoading");
    return UserApi.getLinks(userId)
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("setLinks", res.list);
            commit("endLoading");
          });
        } else {
          commit("endLoading");
        }
      })
      .catch(err => {
        commit("endLoading");
        commit("setError", err.message);
      });
  },
  addLink({ commit }, data) {
    return UserApi.postLink(data).then(response => {
      console.log(response);
      //change data to response
      commit("addLink", data);
      commit("auth/incrementFollowingCount", null, { root: true });
    });
  },
  updateLink({ commit }, data) {
    return UserApi.updateLink(data).then(response => {
      console.log(response);
      commit("updateLink", data);
    });
    // commit("updateLink", data);
  },
  deleteLink({ commit }, linkId) {
    return UserApi.deleteLink(linkId).then(response => {
      console.log(response);
      commit("deleteLink", linkId);
      commit("auth/decrementFollowingCount", null, { root: true });
    });
  },
  clearLinks({ commit }) {
    commit("clearLinks");
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
