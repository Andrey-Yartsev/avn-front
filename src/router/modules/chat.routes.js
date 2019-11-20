import Auth from "../middlewares/auth";

export const routes = [
  {
    beforeEnter: Auth.requireAuth,
    path: "/chat",
    name: "ChatHome",
    component: () =>
      import(/* webpackChunkName: "Chat" */ "@/components/chat/Chat"),
    meta: {
      chat: true,
      cssName: "chat"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/chat/no-messages",
    name: "ChatNoMessages",
    component: () =>
      import(/* webpackChunkName: "Chat" */ "@/components/chat/Chat"),
    meta: {
      chat: true,
      cssName: "chat"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/chat/new",
    name: "ChatNew",
    component: () =>
      import(/* webpackChunkName: "ChatNewMessage" */ "@/components/chat/NewMessage"),
    meta: {
      chat: true,
      cssName: "newChat"
    }
  },
  {
    beforeEnter: Auth.requireAuth,
    path: "/chat/:userId",
    name: "ChatUser",
    component: () =>
      import(/* webpackChunkName: "Chat" */ "@/components/chat/Chat"),
    meta: {
      chat: true,
      cssName: "chat"
    }
  }
];
