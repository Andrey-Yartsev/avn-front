"use strict";

import BrowserStore from "store";

import { gayDomain, straightDomain } from "@/helpers/domains";

const state = {
  category: 1,
  notSuggestStartTime: 0
};

const notSuggestSomeTimeMinutes = 60 * 3;

const mutations = {
  setCategory(state, category) {
    state.category = category;
  },
  notSuggestStartTime(state, time) {
    state.notSuggestStartTime = time;
  }
};

const actions = {
  init({ dispatch, rootState }) {
    if (!rootState.auth.token) {
      dispatch("initGuestCategory");
    } else {
      const user = rootState.auth.user;

      if (!user) {
        return;
      }
      const isGayFront = !!window.location.hostname.match(/gayvn/);

      if (!isGayFront) {
        return;
      }

      let newCat, newCatText;
      if (isGayFront && user.categoryView !== 3) {
        newCat = 3;
        newCatText = "Gay";
      } else if (!isGayFront && user.categoryView === 3) {
        newCat = 2;
        newCatText = "Straight";
      }
      if (newCat) {
        dispatch(
          "profile/extendSilent",
          {
            categoryView: newCat
          },
          { root: true }
        );
        dispatch(
          "global/flashToast",
          {
            text: "Your Default Viewing Preference was switched to " + newCatText
          },
          { root: true }
        );
      }
    }
  },
  initGuestCategory({ commit }) {
    let genderCategory = parseInt(BrowserStore.get("genderCategory"));

    if (!genderCategory) {
      return;
    }

    commit("setCategory", genderCategory);
  },
  setGuestCategory({ commit }, genderCategory) {
    commit("setCategory", genderCategory);
    BrowserStore.set("genderCategory", genderCategory);
  },
  suggestContext({ dispatch }, profileCategory) {
    const isGayFront = !!window.location.hostname.match(/gayvn/);

    if (profileCategory !== 3) {
      return;
    }
    if (isGayFront) {
      return;
    }

    const timeBefore = BrowserStore.get("notSuggestStartTime");

    if (timeBefore) {
      const time = new Date().getTime();
      const sec = Math.round((time - timeBefore) / 1000);
      const min = Math.round(sec / 60);
      if (min < notSuggestSomeTimeMinutes) {
        return;
      }
    }

    const doNotSuggestContext = BrowserStore.get("doNotSuggestContext");
    if (doNotSuggestContext) {
      return;
    }
    dispatch(
      "modal/show",
      {
        name: "gayContextConfirm"
      },
      { root: true }
    );
  },
  doNotSuggest() {
    BrowserStore.set("doNotSuggestContext", true);
  },
  doNotSuggestSomeTime({ commit }) {
    const time = new Date().getTime();
    BrowserStore.set("notSuggestStartTime", time);
    commit("notSuggestStartTime", time);
  },
  initProfile({ dispatch }, profile) {
    dispatch("suggestContext", profile.category);
  },
  switchDomain({ rootState }, id) {
    const isGayFront = !!window.location.hostname.match(/gayvn/);
    const switchToGay = id === 3;

    const swtch = () => {
      let t = "";
      if (rootState.auth.token) {
        t = "?auth_token=" + rootState.auth.token;
      } else {
        t = "?gender=" + id;
      }
      if (switchToGay && !isGayFront) {
        window.location = gayDomain(window.location.pathname + t);
        return true;
      }
      if (!switchToGay && isGayFront) {
        window.location = straightDomain(window.location.pathname + t);
        return true;
      }
      return false;
    };

    return swtch();
  },
  switchCategory({ state, rootState, dispatch, commit }, id) {
    id = parseInt(id);

    if (state.category === id) {
      return;
    }

    const isGayFront = !!window.location.hostname.match(/gayvn/);
    const switchToGay = id === 3;
    let isSilent = false;

    const swtch = () => {
      let t = "";
      if (rootState.auth.token) {
        t = "?auth_token=" + rootState.auth.token;
      } else {
        t = "?gender=" + id;
      }
      if (switchToGay && !isGayFront) {
        window.location = gayDomain(window.location.pathname + t);
        isSilent = true;
      }
      if (!switchToGay && isGayFront) {
        window.location = straightDomain(window.location.pathname + t);
        isSilent = true;
      }
    };

    if (rootState.auth.user) {
      const user = { ...rootState.auth.user };
      user.categoryView = id;

      dispatch("profile/update" + (isSilent ? "Silent" : ""), user, {
        root: true
      }).then(() => {
        commit("setCategory", id);

        setTimeout(swtch, 1000);
      });
    } else {
      dispatch("setGuestCategory", id);
      setTimeout(swtch, 100);
    }
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
