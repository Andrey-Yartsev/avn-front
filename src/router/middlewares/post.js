"use strict";

import Store from "@/store";
import Auth from "./auth";

const Post = {
  page(to, from, next) {
    Auth.requireAny(to, from, () => {
      Store.commit("postPage/resetPageState");
      Store.dispatch("postPage/getPost", { postId: to.params.postId })
        .then(() => {
          next();
        })
        .catch(() => {
          next("/not-found");
        });
    });
  }
};

export default Post;
