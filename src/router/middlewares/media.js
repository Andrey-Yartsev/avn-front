import Store from "@/store";
import Auth from "./auth";

const Post = {
  page(to, from, next) {
    const { username, productId } = to.params;
    if (username && productId) {
      next(`/${username}/media#m/media/${productId}/profile/home`);
    }
    Auth.requireAny(to, from, () => {
      Store.dispatch(
        "mediaPage/getMediaItem",
        {
          productId: productId
        },
        { root: true }
      )
        .then(res => {
          next(
            `/${res.author.username}/media#m/media/${productId}/profile/home`
          );
        })
        .catch(() => {
          next("/not-found");
        });
    });
  }
};

export default Post;
