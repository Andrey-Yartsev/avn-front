import { createRequestAction } from "../../utils/storeRequest";

const initState = {
  links: [],
  editedLink: null
};

const state = { ...initState };

const mutations = {
  startEditLink(state, payload) {
    state.editedLink = payload;
  },
  endEditLink(state) {
    state.editedLink = null;
  },
  deleteLink(state, id) {
    state.links = state.links.filter(item => item.id !== id);
  }
};

const actions = {
  async deleteLink({ dispatch, commit }, linkId) {
    await dispatch("_deleteLink", linkId);
    commit("deleteLink", linkId);
    commit("endEditLink");
    commit("auth/decrementFollowingCount", null, { root: true });
  },
  async addLink({ dispatch, commit }, data) {
    await dispatch("_addLink", data);
    commit("auth/incrementFollowingCount", null, { root: true });
  }
};

createRequestAction({
  requestType: "any",
  prefix: "getLinks",
  apiPath: "links/{userId}",
  resultKey: "links",
  state,
  mutations,
  actions,
  options: {
    method: "GET"
  },
  paramsToPath: function(params, path) {
    return path.replace(/{userId}/, params);
  },
  resultConvert: function(res) {
    const links = res.list.sort(a => (a.pinned ? -1 : 1));
    return links;
  }
});

createRequestAction({
  prefix: "_addLink",
  apiPath: "links",
  resultKey: "links",
  state,
  mutations,
  actions,
  options: {
    method: "POST"
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  },
  resultConvert: function(newLink, state) {
    const arr = newLink.pinned
      ? [newLink, ...state.links]
      : [...state.links, newLink];
    return arr;
  }
});

createRequestAction({
  prefix: "updateLink",
  apiPath: "links/{linkId}",
  resultKey: "links",
  state,
  mutations,
  actions,
  options: {
    method: "PUT"
  },
  paramsToPath: function(data, path) {
    return path.replace(/{linkId}/, data.id);
  },
  paramsToOptions: function(params, options) {
    options.data = params;
    return options;
  },
  resultConvert: function(newLink, state) {
    const arr = state.links.map(item =>
      item.id === newLink.id ? newLink : item
    );
    return arr;
  }
});

createRequestAction({
  prefix: "_deleteLink",
  apiPath: "links/{linkId}",
  resultKey: "links",
  state,
  mutations,
  actions,
  options: {
    method: "DELETE"
  },
  paramsToPath: function(linkId, path) {
    return path.replace(/{linkId}/, linkId);
  },
  resultConvert: function(res, state) {
    return state.links;
  }
});

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
