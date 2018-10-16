import Vue from "vue";
import Vuex from "vuex";

import global from "@/store/modules/global";
import auth from "@/store/modules/auth";
import home from "@/store/modules/home";
import post from "@/store/modules/post";
import postPage from "@/store/modules/postPage";
import profile from "@/store/modules/profile";
import signUp from "@/store/modules/signUp";
import otp from "@/store/modules/otp";
import sessions from "@/store/modules/sessions";
import common from "@/store/modules/common";
import modal from "@/store/modules/modal";
import chat from "@/store/modules/chat";
import user from "@/store/modules/user";
import modalRouter from "@/store/modules/modalRouter";
import explore from "@/store/modules/explore/index";
import notif from "@/store/modules/notif";

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",

  modules: {
    global,
    auth,
    home,
    profile,
    signUp,
    common,
    otp,
    sessions,
    post,
    modal,
    chat,
    user,
    postPage,
    modalRouter,
    explore,
    notif
  }
});

export default store;
