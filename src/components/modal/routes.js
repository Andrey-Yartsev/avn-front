import PostModal from "@/components/post/ModalView";
import NotifModal from "@/components/pages/notification/Modal";
import ChatModal from "@/components/chat/Modal";
import ImageModal from "@/components/modal/Image";

export default {
  "post/:postId/:from": {
    component: PostModal,
    enterRedirect: params => {
      return "/post/" + params.postId;
    }
  },
  notifications: NotifModal,
  "notifications/:type": NotifModal,

  chat: ChatModal,
  "chat/new": {
    component: ChatModal,
    _name: "ChatNew"
  },
  "chat/:userId": ChatModal,
  "image/:src": ImageModal
};
