import Auth from "../middlewares/auth";
import Post from "../middlewares/post";

export const routes = [
  {
    beforeEnter: Auth.requireAuth,
    path: "/addPost",
    name: "PostAdd",
    component: () =>
      import(/* webpackChunkName: "AddPostPage" */ "@/components/pages/post/AddPost"),
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
      import(/* webpackChunkName: "EditPostPage" */ "@/components/pages/post/EditPost"),
    meta: {
      cssName: "addPost",
      disabledAddPostButton: true
    }
  },
  {
    beforeEnter: Post.page,
    path: "/post/:username/:postId",
    name: "PostUsernameItem",
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
