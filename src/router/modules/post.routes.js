import Auth from "../middlewares/auth";
import Post from "../middlewares/post";

export const routes = [
  {
    beforeEnter: Auth.requireAuth,
    path: "/addPost",
    name: "PostAdd",
    component: () =>
      import(/* webpackChunkName: "AddPostPage" */ "@/components/pages/addPost/Index"),
    meta: {
      cssName: "addPost",
      disabledAddPostButton: true
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/post/edit/:id",
    name: "PostEdit",
    component: () =>
      import(/* webpackChunkName: "EditPostPage" */ "@/components/pages/editPost/Index"),
    meta: {
      cssName: "addPost",
      disabledAddPostButton: true
    }
  },
  {
    beforeEnter: Post.page,
    path: "/post/:username/:postId",
    name: "PostItem",
    component: () =>
      import(/* webpackChunkName: "PostPage" */ "@/components/pages/post/Index"),
    meta: {
      cssName: "post"
    }
  },
  {
    beforeEnter: Post.page,
    path: "/post/:postId",
    name: "PostItem",
    component: () =>
      import(/* webpackChunkName: "PostPage" */ "@/components/pages/post/Index"),
    meta: {
      cssName: "post"
    }
  }
];
