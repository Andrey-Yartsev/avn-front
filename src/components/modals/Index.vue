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
import PostRepostCommentModal from "@/components/post/parts/repostCommentModal/Modal";
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
import AudioModal from "@/components/modal/Audio.vue";
import ImageSwiperModal from "@/components/modal/ImageSwiper.vue";
import VideoSwiperModal from "@/components/modal/VideoSwiper.vue";
import TrialConfirmModal from "@/components/pages/settings/trials/TrialConfirmModal.vue";
import GayContextConfirmModal from "@/components/pages/awards/GayContextConfirmModal.vue";
import ChatMessagePayConfirmModal from "@/components/chat/ChatMessagePayConfirm";
import BuySnapchatConfirmModal from "@/components/pages/profile/BuySnapchatConfirm";
import TipPayConfirmModal from "@/components/common/tip/TipPayConfirm";
import PostLikesModal from "@/components/post/parts/likesModal/Index";
import ClipLikesModal from "@/components/common/profile/media/parts/modals/clipLikesModal/Index";
import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal";
import EditPostModal from "@/components/post/edit/Modal";
import AddMediaModal from "@/components/addMedia/Modal";
import EditMediaModal from "@/components/common/profile/media/edit/Modal";
import AddGroupModal from "@/components/common/profile/groups/modals/add/Modal";
import EditGroupModal from "@/components/common/profile/groups/modals/edit/Modal";
import MediaAccessLinkModal from "@/components/common/profile/media/parts/modals/AccessLinkModal";
import MediaPayConfirmModal from "@/components/common/profile/media/views/MediaPayModal";
import GroupPayConfirmModal from "@/components/common/profile/groups/modals/GroupPayModal";
import ChatAttachmentsModal from "@/components/chat/AttachmentsModal";
import FreeAccessMediaListModal from "@/components/common/profile/media/parts/modals/FreeAccessMediaListModal";
import ContestVotingModal from "@/components/pages/contest/VotingModal";
import MagShippingModal from "@/components/pages/settings/magazine/ShippingModal";
import GroupMembersModal from "@/components/common/profile/groups/modals/GroupMembersModal";

export default {
  components: {
    PostReportModal,
    PostRepostCommentModal,
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
    AudioModal,
    ImageSwiperModal,
    VideoSwiperModal,
    TrialConfirmModal,
    GayContextConfirmModal,
    ChatMessagePayConfirmModal,
    BuySnapchatConfirmModal,
    TipPayConfirmModal,
    PostLikesModal,
    ClipLikesModal,
    LoginModal,
    SignupModal,
    EditPostModal,
    AddMediaModal,
    EditMediaModal,
    AddGroupModal,
    EditGroupModal,
    MediaPayConfirmModal,
    GroupPayConfirmModal,
    AddRedirectLinkModal,
    MediaAccessLinkModal,
    ContestVotingModal,
    ChatAttachmentsModal,
    FreeAccessMediaListModal,
    MagShippingModal,
    GroupMembersModal
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
