import PostModal from "@/components/post/view/ModalView";
import NotifModal from "@/components/pages/notification/Modal";
import ChatModal from "@/components/chat/Modal";
import ImageModal from "@/components/modal/Image";
import StoryPage from "@/components/pages/story/Index";
import MediaModal from "@/components/common/profile/media/views/MediaModal";

export default {
  "post/:postId/:from": {
    component: PostModal,
    enterRedirect: params => {
      return "/post/" + params.postId;
    }
  },
  "media/:postId/:from": {
    component: MediaModal
    // enterRedirect: params => {
    //   return "/media/" + params.postId;
    // }
  },
  notifications: NotifModal,
  "notifications/:type": NotifModal,
  chat: ChatModal,
  "chat/new": {
    component: ChatModal,
    _name: "ChatNew"
  },
  "chat/:userId": ChatModal,
  "image/:src": ImageModal,
  "stories/:userId": {
    component: StoryPage
  }
};
