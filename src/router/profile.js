"use strict";

import Store from "@/store";
import Auth from "./auth";

const Profile = {
  init(to, from, next) {
    Auth.init(to, from, () => {
      const username = to.params.username;
      const page = to.params.page;

      if (page && ["photos", "videos", "posts", "links"].indexOf(page) === -1) {
        next("/not-found");
        return;
      }

      Store.dispatch("profile/home/fetchProfile", username)
        .then(() => {
          Store.dispatch("profile/setFetchLoading", false);
          next();
        })
        .catch(() => {
          Store.dispatch("profile/setFetchLoading", false);
          next();
        });
    });
  }
};

export default Profile;
