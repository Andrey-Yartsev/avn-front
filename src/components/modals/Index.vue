<template>
  <div>
    <template v-for="type in filteredModals">
      <component
        :key="type.storeName"
        :is="componentName(type.storeName)"
        v-if="$store.state.modal[type.storeName].show"
      />
    </template>
  </div>
</template>

<script>
import modalTypes from "@/components/modals/types";

import PostModal from "@/components/post/view/ModalView";
import PostReportModal from "@/components/post/parts/reportModal/Index";
import MessagesModal from "@/components/chat/Modal";
import ChatVideoModal from "@/components/chat/media/VideoModal";
import CreateStoryModal from "@/components/story/CreateModalView";
import StoryViewersModal from "@/components/story/ViewersModalView";
import CreateHighlightsModal from "@/components/story/CreateHighlightsModal";
import ChooseHighlightModal from "@/components/story/ChooseHighlightModal";
import AddRedirectLinkModal from "@/components/story/AddRedirectLinkModal";
import UserReportModal from "@/components/users/UserReportModal";
import ResubscribeModal from "@/components/subscription/ResubscribeModal";
import PaymentModal from "@/components/subscription/PaymentModal";
import AddPostModal from "@/components/post/add/Modal";
import GroupMessageModal from "@/components/groupMessage/Modal";
import AddLinkModal from "@/components/addLink/Modal";
import StreamModal from "@/components/stream/ViewStreamModal";
import IframeModal from "@/components/modal/Iframe";
import SubscribeModal from "@/components/subscription/SubscribeModal";
import SubscriptionConfirmModal from "@/components/subscription/Confirm";
import ConfirmModal from "@/components/modal/Confirm.vue";
import ImageModal from "@/components/modal/Image.vue";
import TrialConfirmModal from "@/components/pages/settings/trials/TrialConfirmModal.vue";
import GayContextConfirmModal from "@/components/pages/awards/GayContextConfirmModal.vue";
import ChatMessagePayConfirmModal from "@/components/chat/ChatMessagePayConfirm";
import BuySnapchatConfirmModal from "@/components/pages/profile/BuySnapchatConfirm";
import TipPayConfirmModal from "@/components/common/tip/TipPayConfirm";
import PostLikesModal from "@/components/post/parts/likesModal/Index";
import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal";
import EditPostModal from "@/components/post/edit/Modal";
import AddMediaModal from "@/components/addMedia/Modal";
import EditMediaModal from "@/components/common/profile/media/edit/Modal";
import MediaPayConfirmModal from "@/components/common/profile/media/views/MediaPayModal";

export default {
  components: {
    PostReportModal,
    PostModal,
    MessagesModal,
    ChatVideoModal,
    UserReportModal,
    ResubscribeModal,
    PaymentModal,
    CreateStoryModal,
    AddPostModal,
    AddLinkModal,
    GroupMessageModal,
    IframeModal,
    StreamModal,
    SubscribeModal,
    SubscriptionConfirmModal,
    StoryViewersModal,
    CreateHighlightsModal,
    ChooseHighlightModal,
    ConfirmModal,
    ImageModal,
    TrialConfirmModal,
    GayContextConfirmModal,
    ChatMessagePayConfirmModal,
    BuySnapchatConfirmModal,
    TipPayConfirmModal,
    PostLikesModal,
    LoginModal,
    SignupModal,
    EditPostModal,
    AddMediaModal,
    EditMediaModal,
    MediaPayConfirmModal,
    AddRedirectLinkModal
  },
  props: {
    hasLayout: {
      type: Boolean,
      defalut: true
    }
  },
  data() {
    return {
      modalTypes: modalTypes
    };
  },
  computed: {
    filteredModals() {
      if (this.$props.hasLayout) {
        return this.modalTypes;
      } else {
        return this.modalTypes.filter(item => !item.layoutOnlyModal);
      }
    }
  },
  methods: {
    componentName(str) {
      return str[0].toUpperCase() + str.slice(1) + "Modal";
    }
  }
};
</script>
