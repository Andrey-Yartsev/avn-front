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
            const links = res.list.sort(a => (a.pinned ? -1 : 1));
            commit("setLinks", links);
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
    return UserApi.postLink(data)
      .then(response => {
        return response.json();
      })
      .then(res => {
        commit("addLink", res);
        commit("auth/incrementFollowingCount", null, { root: true });
      });
  },
  updateLink({ commit }, data) {
    return UserApi.updateLink(data)
      .then(response => {
        return response.json();
      })
      .then(res => {
        commit("updateLink", res);
      });
  },
  deleteLink({ commit }, linkId) {
    return UserApi.deleteLink(linkId)
      .then(response => {
        return response.json();
      })
      .then(() => {
        commit("deleteLink", linkId);
        commit("endEditLink");
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
