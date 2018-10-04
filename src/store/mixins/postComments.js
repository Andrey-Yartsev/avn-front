import HomeApi from "@/api/home";

export default {
  mutations: {
    postCommentsRequest(state, { postId }) {
      state.posts = state.posts.map(post => {
        if (postId === post.id) {
          return {
            ...post,
            comments: post.comments || [],
            commentsLoading: true,
            shownCommentsCount: 3
          };
        }

        return post;
      });
    },

    postCommentsRequestSuccess(state, data) {
      state.posts = state.posts.map(post => {
        if (data.postId !== post.id) {
          return post;
        }

        return {
          ...post,
          comments: [...post.comments, ...data.list],
          commentsLoading: false
        };
      });
    },

    postSendCommentsRequestSuccess(state, data) {
      state.posts = state.posts.map(post => {
        if (data.postId !== post.id) {
          return post;
        }

        return {
          ...post,
          comments: [data.comment, ...post.comments],
          shownCommentsCount: post.shownCommentsCount + 1
        };
      });
    }
  },

  actions: {
    getPostComments({ commit }, { postId }) {
      commit("postCommentsRequest", { postId });
      return HomeApi.getPostComments({ postId })
        .then(response => {
          if (response.status === 200) {
            response.json().then(function(list) {
              commit("postCommentsRequestSuccess", {
                postId,
                list
              });
            });
          }
        })
        .catch(err => {
          commit("commentsRequestFail", err);
        });
    }
  }
};
