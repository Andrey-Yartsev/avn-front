import Media from "../middlewares/media";

export const routes = [
  {
    beforeEnter: Media.page,
    path: "/media/:username/:productId/:accessToken?",
    component: () =>
      import(/* webpackChunkName: "MediaPage" */ "@/components/pages/media/Index"),
    meta: route => ({
      accessToken: route.params.accessToken
    })
  },
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
