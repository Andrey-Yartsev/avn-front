import StoriesApi from "@/api/stories";
import HighlightsApi from "@/api/highlights";
import Router from "@/router";

const initState = {
  loading: false,
  error: null,
  profileLoading: false,
  profileError: null,
  profile: null,
  posts: [],
  allDataReceived: false,
  limit: 10,
  offset: 0,
  marker: "",
  user: {},
  collection: null
};

const mutations = {
  setCollectionData(state, collection) {
    state.collection = collection;
  },
  userPostsRequestSuccess(state, { list: posts, marker, user }) {
    state.posts = [...state.posts, ...posts];

    if (posts.length < state.limit) {
      state.allDataReceived = true;
    } else {
      state.offset = state.offset + state.limit;
    }
    state.loading = false;
    state.marker = state.marker ? state.marker : marker;
    state.user = user;
  },
  setSource(state, { source }) {
    state.source = source;
  },
  setLimit(state, { limit }) {
    state.limit = limit;
  },
  extendPost(state, data) {
    state.posts = state.posts.map(v => {
      if (v.id === data.id) {
        v = { ...v, ...data };
      }
      return v;
    });
  },
  updatePostLink(state, data) {
    state.post = state.posts.map(item => {
      return item.id === data.id ? data : item;
    });
  },
  removePost(state, authorId) {
    state.posts = state.posts.filter(
      item => item.user && item.user.id !== authorId
    );
  }
};

const actions = {
  getPosts({ commit, state, rootState }) {
    const { limit, offset, marker, source } = state;
    const category = rootState.gender.category;

    commit("postsRequest");

    return StoriesApi.getPosts({ limit, offset, marker, source, category })
      .then(response => {
        if (response.status === 401) {
          Router.push("/login");
          return;
        }

        if (response.status === 200) {
          response.json().then(function(res) {
            commit("postsRequestSuccess", res);
          });
        }
      })
      .catch(err => {
        commit("postsRequestFail", err);
      });
  },
  getUserPosts({ commit }, { userId }) {
    commit("postsRequest");

    return StoriesApi.getUserStory({ userId })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("userPostsRequestSuccess", res);
            if (!res.list.length) {
              commit("postsRequestFail", "User has no stories");
            }
          });
        }

        if (response.status === 404) {
          response.json().then(function(res) {
            commit("postsRequestFail", res.error.message);
          });
        }

        if (response.status === 401) {
          response.json().then(function(res) {
            commit("postsRequestFail", res.error.message);
          });
        }
      })
      .catch(err => {
        commit("postsRequestFail", err);
      });
  },
  getCollection({ commit }, { id }) {
    commit("postsRequest");

    return HighlightsApi.getCollection({ collectionId: id })
      .then(response => {
        if (response.status === 200) {
          response.json().then(function(res) {
            commit("setCollectionData", res);
            commit("userPostsRequestSuccess", { ...res, list: res.stories });
            if (!res.stories.length) {
              commit("postsRequestFail", "Collection is empty");
            }
          });
        }

        if (response.status === 404) {
          response.json().then(function(res) {
            commit("postsRequestFail", res.error.message);
          });
        }

        if (response.status === 401) {
          response.json().then(function(res) {
            commit("postsRequestFail", res.error.message);
          });
        }
      })
      .catch(err => {
        commit("postsRequestFail", err);
      });
  },
  setSource({ commit }, { source }) {
    commit("setSource", { source });
  },
  setLimit({ commit }, { limit }) {
    commit("setLimit", { limit });
  }
};

export default {
  initState,
  actions,
  mutations
};
