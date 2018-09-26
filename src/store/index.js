import Vue from "vue";
import Vuex from "vuex";

import global from "@/store/modules/global";
import auth from "@/store/modules/auth";
import home from "@/store/modules/home";
import profile from "@/store/modules/profile";
import common from "@/store/modules/common";

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",

  modules: {
    global,
    auth,
    home,
    profile,
    common
  }
});

export default store;
