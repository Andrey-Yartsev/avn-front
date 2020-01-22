<template>
  <div v-if="!hasLayout">
    <Modals :hasLayout="false" />
    <ErrorModal v-if="error" />
    <Toast v-if="showToast" @hide="showToast = false" />
    <router-view />
  </div>
  <div v-else class="main-container" :class="containerClassName">
    <Loader v-if="loading" :fulllight="true" />
    <template v-else>
      <Loader
        v-if="this.$store.state.global.loading"
        class="text-light"
        :semidark="true"
      />
      <Header />
      <HeaderStream />
      <main id="content" :style="{ 'padding-right': `${scrollBarWidth}px` }">
        <router-view />
      </main>
      <Sidebar v-if="user" />
      <ToastList v-if="toasts.length" :toasts="toasts" />
      <StoryInput />
      <modal-router />
      <Modals :hasLayout="true" />
      <ErrorModal v-if="error" />
      <a
        v-if="adminReturnUrl"
        :href="adminReturnUrl"
        class="btn alt btn-back-kitchen"
      >
        Return to admin
      </a>
      <UserBubble
        username="stompeg"
        v-show="this.$store.state.userBubble.show"
        id="user-bubble"
      />
    </template>
    <GenderFilterMobile v-if="$store.state.gender.dropdownOpened" />
  </div>
</template>

<script>
import BrowserStore from "store";
import Logger from "js-logger";
import Loader from "@/components/common/Loader";
import Header from "@/components/header/Index";
import HeaderStream from "@/components/headerStream/Index";
import Sidebar from "@/components/header/Sidebar";
import ToastList from "@/components/common/ToastList";
import Modals from "@/components/modals/Index";
import ErrorModal from "@/components/modal/Error";
import StoryInput from "@/components/story/Input";
import UserBubble from "@/components/users/UserBubble.vue";
import GenderFilterMobile from "@/components/common/GenderFilterMobile";
import ModalRouter from "@/components/modal/Router";
import Cookie from "@/utils/cookie";
import rootClasses from "@/utils/rootClasses";
import postMessageHandler from "@/utils/postMessage";
import ws from "@/ws";
import wsg from "@/ws/wsg";
import wsp from "@/ws/wsp";
import BackRouter from "@/mixins/backRouter";
import FrontUpdate from "@/mixins/frontUpdate";
import ColorScheme from "@/mixins/colorScheme";
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
    Modals,
    Loader,
    Header,
    HeaderStream,
    Sidebar,
    ToastList,
    ErrorModal,
    ModalRouter,
    StoryInput,
    UserBubble,
    GenderFilterMobile
  },
  mixins: [ColorScheme, BackRouter, FrontUpdate],
  data() {
    return {
      showToast: false,
      wasLogout: false,
      containerClassName: "",
      enterRouteName: ""
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
    toasts() {
      return this.$store.state.global.toasts;
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
        if (!window.location.pathname.match(/\/nominator\//)) {
          this.$store.dispatch("gender/init");
        }
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
    this.enterRouteName = this.$route.name;
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
