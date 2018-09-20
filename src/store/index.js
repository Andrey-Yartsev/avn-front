import Vue from "vue";
import Vuex from "vuex";

import auth from "@/store/modules/auth";
import home from "@/store/modules/home";

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",

  modules: {
    auth,
    home
  }
});

export default store;
