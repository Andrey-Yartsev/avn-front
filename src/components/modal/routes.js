import PostModal from "@/components/post/ModalView";
// import ChatModal from "@/components/chat/modal/Chat";
import NotifModal from "@/components/pages/notifications/Modal";

export default {
  "post/:postId/:from": {
    component: PostModal,
    enterRedirect: params => {
      return "/post/" + params.postId;
    }
  },
  notifications: NotifModal,
  "notifications/:type": NotifModal
  // chat: ChatModal,
  // "chat/home": {
  //   component: ChatModal,
  //   _name: "ChatHome"
  // },
  // "chat/new": ChatModal,
  // "chat/:userId": ChatModal
};
