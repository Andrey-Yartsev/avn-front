import Vue from "vue";
import Vuex from "vuex";

import global from "@/store/modules/global";
import auth from "@/store/modules/auth";
import init from "@/store/modules/init";
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
import explore from "@/store/modules/explore/index";
import topModels from "@/store/modules/explore/topModels";
import lives from "@/store/modules/lives";
import stories from "@/store/modules/stories";
import storiesArchive from "@/store/modules/storiesArchive";
import story from "@/store/modules/story";
import modalRouter from "@/store/modules/modalRouter";
import notif from "@/store/modules/notif";
import search from "@/store/modules/search";
import subscription from "@/store/modules/subscription";
import payment from "@/store/modules/payment";
import payouts from "@/store/modules/payouts";
import twitter from "@/store/modules/twitter";
import emails from "@/store/modules/emails";
import blocked from "@/store/modules/blocked";
import tip from "@/store/modules/tip";
import followers from "@/store/modules/followers";
import contacts from "@/store/modules/contacts";
import forgot from "@/store/modules/forgot";
import paidMessage from "@/store/modules/paidMessage";
import viewers from "@/store/modules/viewers";
import highlights from "@/store/modules/highlights";
import staticPage from "@/store/modules/staticPage";
import support from "@/store/modules/support";
import credits from "@/store/modules/credits";
import postQueue from "@/store/modules/postQueue";
import referrals from "@/store/modules/referrals";
import countries from "@/store/modules/countries";
import states from "@/store/modules/states";
import trial from "@/store/modules/trial";

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",

  modules: {
    global,
    auth,
    init,
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
    stories,
    story,
    lives,
    notif,
    search,
    subscription,
    payment,
    payouts,
    twitter,
    emails,
    blocked,
    tip,
    followers,
    contacts,
    forgot,
    paidMessage,
    viewers,
    highlights,
    storiesArchive,
    staticPage,
    support,
    credits,
    postQueue,
    referrals,
    countries,
    states,
    topModels,
    trial
  }
});

export default store;
