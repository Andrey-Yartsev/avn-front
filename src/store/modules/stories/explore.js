"use strict";

import PostMixin from "@/store/mixins/posts";
import StoryMixin from "@/store/mixins/stories";

const initState = {
  ...StoryMixin.initState,
  ...{ source: "" }
};

const mutations = {
  resetPageState(state) {
    for (let k of Object.keys(initState)) {
      state[k] = initState[k];
    }
  }
};

export default {
  namespaced: true,
  state: { ...initState },
  actions: { ...PostMixin.actions, ...StoryMixin.actions },
  mutations: { ...PostMixin.mutations, ...StoryMixin.mutations, ...mutations }
};
