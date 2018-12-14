"use strict";

import Store from "@/store";
import Router from "@/router";
import UserApi from "@/api/user";

export default {
  logout() {
    UserApi.logout();
    Store.dispatch("auth/logout").then(() => {
      Router.push("/login");
    });
  }
};
