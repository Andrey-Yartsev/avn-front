<template>
  <div
    class="main-container"
    v-bind:style="{ 'padding-right': scrollBarWidth + 'px' }"
  >
    <Loader v-if="loading" class="page-loader" />
    <template v-else>
      <Header />
      <main id="content">
        <router-view />
      </main>
      <Sidebar v-if="user" />
      <Toast v-if="showToast" @hide="showToast = false" />
      <StoryInput />

      <modal-router />

      <PostModal v-if="this.$store.state.modal.post.show" />
      <PostReportModal v-if="this.$store.state.modal.postReport.show" />
      <ChatModal v-if="this.$store.state.modal.messages.show" />
      <UserReportModal v-if="this.$store.state.modal.userReport.show" />
      <SubscribeModal v-if="this.$store.state.modal.subscribe.show" />
      <ResubscribeModal v-if="this.$store.state.modal.resubscribe.show" />
      <CreateStoryModal v-if="this.$store.state.modal.createStory.show" />
      <AddPostModal v-if="this.$store.state.modal.addPost.show" />
      <IframeModal v-if="this.$store.state.modal.iframe.show" />
      <StreamModal v-if="this.$store.state.modal.stream.show" />
      <StoryViewerModal v-if="this.$store.state.modal.storyViewers.show" />
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
import CreateStoryModal from "@/components/story/CreateModalView";
import StoryViewerModal from "@/components/story/ViewersModalView";
import CreateHighlightsModal from "@/components/story/CreateHighlightsModal";
import UserReportModal from "@/components/common/UserReportModal";
import SubscribeModal from "@/components/subscription/SubscribeModal";
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

import Cookie from "@/utils/cookie";
import rootClasses from "@/rootClasses";
import postMessageHandler from "@/postMessage";
import ws from "@/ws";
import wsg from "@/ws/wsg";

// iterate

const queryString = require("query-string");

const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth;
};

const htmlElement = document.getElementsByTagName("html")[0];

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
    UserReportModal,
    SubscribeModal,
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
    CreateHighlightsModal
  },
  mixins: [ColorScheme],
  data() {
    return {
      showToast: false,
      wasLogout: false
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
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
        this.webSocket.close();
        this.wasLogout = true;
      } else {
        if (this.wasLogout) {
          this.webSocket.connect();
        }
      }
      this.initLoggedInClass();
    },
    loading() {
      this.initWs();
    }
  },
  methods: {
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
      } else {
        this.webSocket = wsg;
      }
      this.webSocket.connect();
      this.$root.ws = this.webSocket;
    }
  },
  created() {
    const params = queryString.parse(location.search);
    if (params.code) {
      Cookie.set("code", params.code, {
        path: "/"
      });
    }

    window.addEventListener("message", postMessageHandler);
  },

  beforeDestroy() {
    window.removeEventListener("message", postMessageHandler);
  },

  mounted() {
    setTimeout(() => {
      this.$store.commit("global/setScrollBarInitWidth", getScrollbarWidth());
    }, 3000);

    let currentScroll = window.pageYOffset;
    document.body.onscroll = function() {
      if (currentScroll < window.pageYOffset) {
        document.body.classList.add("scroll-top");
      } else {
        document.body.classList.remove("scroll-top");
      }
      currentScroll = window.pageYOffset;
    };

    this.initLoggedInClass();
  }
};
</script>

<style lang="scss" src="@/styles/main.scss"></style>
<style lang="scss" src="@/styles/colorScheme.scss"></style>
<style lang="scss" src="@/styles/team.scss"></style>
