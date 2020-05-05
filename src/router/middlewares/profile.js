"use strict";

import Store from "@/store";
import Auth from "./auth";

const Profile = {
  init(to, from, next) {
    Auth.init(to, from, () => {
      const username = to.params.username.toLowerCase();
      const page = to.params.page;

      if (
        page &&
        ["photos", "videos", "posts", "links", "media", "groups"].indexOf(
          page
        ) === -1
      ) {
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
  },
  media(to, from, next) {
    Auth.init(to, from, () => {
      const username = to.params.username.toLowerCase();
      const accessToken = to.params.accessToken;

      const fetchProfile = () => {
        Store.dispatch("profile/home/fetchProfile", username)
          .then(() => {
            Store.dispatch("profile/setFetchLoading", false);
            next(`/${username}/media`);
          })
          .catch(() => {
            Store.dispatch("profile/setFetchLoading", false);
            next(`/${username}/media`);
          });
      };

      const isLoggedIn = () => {
        return !!Store.state.auth.user;
      };

      const isAuthor = () => {
        return Store.state.auth.user.username === username;
      };

      if (isLoggedIn() && !isAuthor()) {
        Store.dispatch("profile/media/getFullFreeAccess", { accessToken })
          .then(() => {
            Store.dispatch("global/flashToast", {
              text: "You've got free access to all users clips",
              type: "success"
            });
          })
          .catch(err => {
            Store.dispatch("global/flashToast", {
              text: err.message,
              type: "error"
            });
          })
          .finally(() => {
            fetchProfile();
          });
      } else {
        fetchProfile();
      }
    });
  }
};

export default Profile;
