import Store from "@/store";
import Auth from "./auth";

const Post = {
  page(to, from, next) {
    Auth.requireAny(to, from, () => {
      Store.dispatch(
        "mediaPage/getMediaItem",
        {
          productId: to.params.productId
        },
        { root: true }
      )
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
