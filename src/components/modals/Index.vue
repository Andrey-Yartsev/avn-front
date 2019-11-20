<template>
  <div>
    <template v-for="type in filteredModals">
      <component
        :key="type.storeName"
        :is="type.componentName"
        v-if="$store.state.modal[type.storeName].show"
      />
    </template>
  </div>
</template>

<script>
import modalTypes from "@/components/modals/types";

import PostModal from "@/components/post/view/ModalView";
import PostReportModal from "@/components/post/parts/reportModal/Index";
import ChatModal from "@/components/chat/Modal";
import ChatVideoModal from "@/components/chat/media/VideoModal";
import CreateStoryModal from "@/components/story/CreateModalView";
import StoryViewerModal from "@/components/story/ViewersModalView";
import CreateHighlightsModal from "@/components/story/CreateHighlightsModal";
import ChooseHighlightModal from "@/components/story/ChooseHighlightModal";
import UserReportModal from "@/components/common/UserReportModal";
import ResubscribeModal from "@/components/subscription/ResubscribeModal";
import PaymentModal from "@/components/subscription/PaymentModal";
import AddPostModal from "@/components/post/add/Modal";
import GroupMessageModal from "@/components/groupMessage/Modal";
import AddLinkModal from "@/components/addLink/Modal";
import StreamModal from "@/components/stream/ViewStreamModal";
import IframeModal from "@/components/modal/Iframe";
import SubscribeModal from "@/components/subscription/SubscribeModal";
import SubscriptionConfirmModal from "@/components/subscription/Confirm";
import Confirm from "@/components/modal/Confirm.vue";
import ImageModal from "@/components/modal/Image.vue";
import TrialConfirmModal from "@/components/pages/settings/trials/TrialConfirmModal.vue";
import GayContextConfirmModal from "@/components/pages/awards/GayContextConfirmModal.vue";
import ChatMessagePayConfirm from "@/components/chat/ChatMessagePayConfirm";
import BuySnapchatConfirm from "@/components/pages/profile/BuySnapchatConfirm";
import TipPayConfirm from "@/components/common/tip/TipPayConfirm";
import PostLikesModal from "@/components/post/parts/likesModal/Index";
import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal";

export default {
  components: {
    PostReportModal,
    PostModal,
    ChatModal,
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
    StoryViewerModal,
    CreateHighlightsModal,
    ChooseHighlightModal,
    Confirm,
    ImageModal,
    TrialConfirmModal,
    GayContextConfirmModal,
    ChatMessagePayConfirm,
    BuySnapchatConfirm,
    TipPayConfirm,
    PostLikesModal,
    LoginModal,
    SignupModal
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
  }
};
</script>
