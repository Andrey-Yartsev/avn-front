"use strict";

import Store from "@/store";
import Auth from "./auth";

const Profile = {
  init(to, from, next) {
    Auth.init(to, from, () => {
      // next();
      const username = to.params[0].replace(/\/(.*)/, "$1");
      // console.log("fetching");
      Store.dispatch("profile/home/fetchProfile", username).then(() => {
        Store.dispatch("profile/setFetchLoading", false);
        next();
      });
    });
  }
};

export default Profile;
