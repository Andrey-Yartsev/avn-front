<template>
  <div v-if="!hasLayout">
    <router-view />
  </div>
  <div v-else class="main-container" :class="containerClassName">
    <Loader v-if="loading" class="page-loader" />
    <template v-else>
      <Loader text="" v-if="this.$store.state.global.loading" />
      <Header />
      <main id="content" :style="{ 'padding-right': `${scrollBarWidth}px` }">
        <router-view />
      </main>
      <Sidebar v-if="user" />
      <Toast v-if="showToast" @hide="showToast = false" />
      <StoryInput />

      <modal-router />

      <PostModal v-if="this.$store.state.modal.post.show" />
      <PostReportModal v-if="this.$store.state.modal.postReport.show" />
      <ChatVideoModal v-if="this.$store.state.modal.chatVideo.show" />
      <ChatModal v-if="this.$store.state.modal.messages.show" />
      <UserReportModal v-if="this.$store.state.modal.userReport.show" />
      <rl-subscribe-modal v-if="this.$store.state.modal.subscribe.show" />
      <ResubscribeModal v-if="this.$store.state.modal.resubscribe.show" />
      <CreateStoryModal v-if="this.$store.state.modal.createStory.show" />
      <AddPostModal v-if="this.$store.state.modal.addPost.show" />
      <IframeModal v-if="this.$store.state.modal.iframe.show" />
      <StreamModal v-if="this.$store.state.modal.stream.show" />
      <StoryViewerModal v-if="this.$store.state.modal.storyViewers.show" />
      <ChooseHighlightModal
        v-if="this.$store.state.modal.chooseHighlight.show"
      />
      <CreateHighlightsModal
        v-if="this.$store.state.modal.createHighlights.show"
      />
      <SubscriptionConfirmModal
        v-if="this.$store.state.modal.subscriptionConfirm.show"
      />
      <LoginModal v-if="this.$store.state.modal.login.show" />
      <SignupModal v-if="this.$store.state.modal.signup.show" />
      <PaymentModal v-if="this.$store.state.modal.payment.show" />
      <ErrorModal v-if="error" />
      <Confirm v-if="this.$store.state.modal.confirm.show" />
      <ImageModal v-if="this.$store.state.modal.image.show" />
      <TrialConfirmModal v-if="this.$store.state.modal.trialConfirm.show" />
      <a
        v-if="adminReturnUrl"
        :href="adminReturnUrl"
        class="btn alt btn-back-kitchen"
      >
        Return to admin
      </a>
      <avn-tip-pay-confirm v-if="this.$store.state.modal.tipPayConfirm.show" />
      <avn-chat-message-pay-confirm
        v-if="this.$store.state.modal.chatMessagePayConfirm.show"
      />
      <avn-buy-snapchat-pay-confirm
        v-if="this.$store.state.modal.buySnapchatConfirm.show"
      />
      <UserBubble
        username="stompeg"
        v-show="this.$store.state.userBubble.show"
        id="user-bubble"
      />
    </template>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import Header from "@/components/header/Index";
import Sidebar from "@/components/header/Sidebar";
import Toast from "@/components/common/Toast";
import ColorScheme from "@/mixins/colorScheme";
import ErrorModal from "@/components/modal/Error";
import PostModal from "@/components/post/ModalView";
import PostReportModal from "@/components/common/postParts/reportModal/Index";
import ChatModal from "@/components/chat/Modal";
import ChatVideoModal from "@/components/chat/media/VideoModal";
import CreateStoryModal from "@/components/story/CreateModalView";
import StoryViewerModal from "@/components/story/ViewersModalView";
import CreateHighlightsModal from "@/components/story/CreateHighlightsModal";
import ChooseHighlightModal from "@/components/story/ChooseHighlightModal";
import UserReportModal from "@/components/common/UserReportModal";
import ResubscribeModal from "@/components/subscription/ResubscribeModal";
import PaymentModal from "@/components/subscription/PaymentModal";
import ModalRouter from "@/components/modal/Router";
import StoryInput from "@/components/story/Input";
import AddPostModal from "@/components/addPost/Modal";
import StreamModal from "@/components/stream/ViewStreamModal";
import IframeModal from "@/components/modal/Iframe";
import SubscriptionConfirmModal from "@/components/subscription/Confirm";
import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal";
import Confirm from "@/components/pages/settings/Confirm.vue";
import ImageModal from "@/components/modal/Image.vue";
import TrialConfirmModal from "@/components/pages/settings/trials/TrialConfirmModal.vue";

import UserBubble from "@/components/users/UserBubble.vue";

import Cookie from "@/utils/cookie";
import BrowserStore from "store";
import Logger from "js-logger";

import rootClasses from "@/rootClasses";
import postMessageHandler from "@/postMessage";
import ws from "@/ws";
import wsg from "@/ws/wsg";
import wsp from "@/ws/wsp";

import BackRouter from "@/mixins/backRouter";

import { fromNow } from "@/helpers/datetime";

fromNow("2019-05-03T11:01:12+00:00");

const queryString = require("query-string");
const trialLogger = Logger.get("trial");

const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth;
};

const htmlElement = document.getElementsByTagName("html")[0];

(function() {
  document.addEventListener(
    "touchstart",
    event => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    },
    { passive: false }
  );

  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    event => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );
})();

export default {
  components: {
    Loader,
    Header,
    Sidebar,
    Toast,
    ErrorModal,
    PostReportModal,
    PostModal,
    ChatModal,
    ChatVideoModal,
    UserReportModal,
    ResubscribeModal,
    PaymentModal,
    ModalRouter,
    CreateStoryModal,
    StoryInput,
    AddPostModal,
    IframeModal,
    StreamModal,
    SubscriptionConfirmModal,
    LoginModal,
    SignupModal,
    StoryViewerModal,
    CreateHighlightsModal,
    ChooseHighlightModal,
    Confirm,
    ImageModal,
    TrialConfirmModal,
    UserBubble
  },
  mixins: [ColorScheme, BackRouter],
  data() {
    return {
      showToast: false,
      wasLogout: false,
      containerClassName: ""
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    adminReturnUrl() {
      if (this.user) {
        return this.user.adminReturnUrl;
      }

      return undefined;
    },
    toastShowTrigger() {
      return this.$store.state.global.toastShowTrigger;
    },
    loading() {
      if (this.$store.state.modalRouter.loading) {
        return true;
      }
      if (this.$store.state.auth.loginInProgress) {
        return true;
      }
      if (this.$store.state.init.fetchLoading) {
        return true;
      }
      return this.$store.state.profile.fetchLoading;
    },
    error() {
      return !!this.$store.state.global.error;
    },
    cssName() {
      if (this.notFound) {
        return "staticPage";
      }
      return this.$route.meta.cssName;
    },
    darkTheme() {
      return this.$store.state.global.darkTheme;
    },
    loggedIn() {
      if (!this.user) {
        return false;
      }
      return true;
    },
    scrollBarWidth() {
      if (!this.$store.state.global.modalOpened) {
        return 0;
      }
      return this.$store.state.global.scrollBarWidth;
    },
    notFound() {
      if (!this.$route.meta.profile) {
        return false;
      }
      return !!this.$store.state.profile.home.fetchProfileError;
    },
    loginInProgress() {
      return this.$store.state.auth.loginInProgress;
    },
    hasLayout() {
      return !this.$route.meta.noLayout;
    }
  },
  watch: {
    toastShowTrigger() {
      this.showToast = true;
    },
    $route() {
      this.$store.dispatch("modal/hideAll");
    },
    cssName: {
      immediate: true,
      handler(cssName) {
        htmlElement.className = "";
        const classList = rootClasses[cssName] || [];
        for (let cls of classList) {
          htmlElement.classList.add(cls);
        }
        if (this.darkTheme) {
          htmlElement.classList.add("dark-theme");
        }
        this.initLoggedInClass();
      }
    },
    darkTheme(darkTheme) {
      if (darkTheme) {
        htmlElement.classList.add("dark-theme");
      } else {
        htmlElement.classList.remove("dark-theme");
      }
    },
    loggedIn(loggedIn) {
      if (!loggedIn) {
        this.initWs();
        this.wasLogout = true;
      } else {
        if (this.wasLogout) {
          this.webSocket.connect();
        }
        this.initTrial();
      }
      this.initLoggedInClass();
    },
    loading(loading) {
      if (!loading) {
        this.initWs();
      }
    }
  },
  methods: {
    setContainerClass() {
      if (this.$root.isAvnApp) {
        this.containerClassName = "avn-style";
      }
    },
    initLoggedInClass() {
      if (this.loggedIn) {
        htmlElement.classList.remove("not-authorized");
      } else {
        htmlElement.classList.add("not-authorized");
      }
    },
    initWs() {
      if (this.webSocket && this.webSocket.connected) {
        this.webSocket.close();
      }
      if (this.loggedIn) {
        this.webSocket = ws;
        wsp.connect();
      } else {
        this.webSocket = wsg;
        if (wsp.connected) {
          wsp.close();
        }
      }
      this.webSocket.connect();
      this.$root.ws = this.webSocket;
    },
    initTrial() {
      setTimeout(() => {
        if (this.user) {
          trialLogger.info("user exists");
          const code = BrowserStore.get("trialCode");
          if (code) {
            trialLogger.info("code exists: " + code);
            this.$store.dispatch("modal/show", {
              name: "trialConfirm",
              data: {
                code
              }
            });
          } else {
            trialLogger.info("code does not exists in store");
          }
        } else {
          trialLogger.info("user does not exists");
        }
      }, 1000);
    }
  },
  created() {
    this.$store.dispatch("init/fetch");

    const queryParams = queryString.parse(window.location.search);

    if (queryParams.code) {
      Cookie.set("code", queryParams.code, {
        path: "/"
      });
    }

    window.addEventListener("message", postMessageHandler);

    this.initTrial();
  },

  beforeDestroy() {
    window.removeEventListener("message", postMessageHandler);
  },

  mounted() {
    setTimeout(() => {
      this.$store.commit("global/setScrollBarInitWidth", getScrollbarWidth());
    }, 3000);

    this.initLoggedInClass();

    this.$nextTick(() => {
      this.setContainerClass();
    });
  }
};
</script>

<style lang="scss" src="@/styles/main.scss"></style>
<style lang="scss" src="@/styles/colorScheme.scss"></style>
<style lang="scss" src="@/styles/team.scss"></style>
