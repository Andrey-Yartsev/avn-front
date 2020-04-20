import Store from "@/store";
import Auth from "./auth";

const Post = {
  page(to, from, next) {
    const { username, productId } = to.params;
    if (username && productId) {
      let stringUrl = `/${username}/media#m/media/${productId}/profile/home`;
      if (to.params.accessToken) {
        stringUrl += `?accessToken=${to.params.accessToken}`;
      }
      next(stringUrl);
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
          let stringUrl = `/${
            res.author.username
          }/media#m/media/${productId}/profile/home`;
          if (to.params.accessToken) {
            stringUrl += `?accessToken=${to.params.accessToken}`;
          }
          next(stringUrl);
        })
        .catch(() => {
          next("/not-found");
        });
    });
  }
};

export default Post;
