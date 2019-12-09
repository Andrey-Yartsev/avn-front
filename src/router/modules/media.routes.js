import Media from "../middlewares/media";

export const routes = [
  {
    beforeEnter: Media.page,
    path: "/media/:productId",
    name: "MediaItem",
    component: () =>
      import(/* webpackChunkName: "MediaPage" */ "@/components/pages/media/Index"),
    meta: {
      // cssName: "post"
      cssName: "media"
    }
  }
];
