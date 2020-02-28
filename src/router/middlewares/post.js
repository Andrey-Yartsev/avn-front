"use strict";

import Store from "@/store";
import Auth from "./auth";

const Post = {
  page(to, from, next) {
    const { username, postId } = to.params;
    if (username && postId) {
      next(`/${username}/posts#m/post/${postId}/profile/home`);
    }
    Auth.requireAny(to, from, () => {
      Store.commit("postPage/resetPageState");
      Store.dispatch("postPage/getPost", { postId: to.params.postId })
        .then(res => {
          next(`/${res.author.username}/posts#m/post/${postId}/profile/home`);
        })
        .catch(() => {
          next("/not-found");
        });
    });
  }
};

export default Post;
