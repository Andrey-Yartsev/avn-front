<template>
  <div class="main-container">
    <Loader v-if="loading" class="page-loader"/>
    <template v-else>

      <Header/>
      <main id="content">
        <router-view />
      </main>
      <Sidebar v-if="user"/>
      <Toast v-if="showToast" @hide="showToast = false" />
      <StoryInput />

      <modal-router />

      <ErrorModal v-if="error" />
      <PostModal v-if="this.$store.state.modal.post.show" />
      <PostReportModal v-if="this.$store.state.modal.postReport.show" />
      <ChatModal v-if="this.$store.state.modal.messages.show" />
      <UserReportModal v-if="this.$store.state.modal.userReport.show" />
      <SubscribeModal v-if="this.$store.state.modal.subscribe.show" />
      <PaymentModal v-if="this.$store.state.modal.payment.show" />
      <CreateStoryModal v-if="this.$store.state.modal.createStory.show" />

    </template>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import Header from "@/components/header/Index";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/common/Toast";
import ColorScheme from "@/mixins/colorScheme";
import ErrorModal from "@/components/modal/Error";
import PostModal from "@/components/post/ModalView";
import PostReportModal from "@/components/common/postParts/reportModal/Index";
import ChatModal from "@/components/chat/Modal";
import CreateStoryModal from "@/components/story/CreateModalView";
import UserReportModal from "@/components/common/UserReportModal";
import SubscribeModal from "@/components/subscription/Modal";
import PaymentModal from "@/components/subscription/PaymentModal";
import ModalRouter from "@/components/modal/Router";
import StoryInput from "@/components/story/Input";

import rootClasses from "@/rootClasses";
import ws from "@/ws";
import Cookie from "@/utils/cookie";

const queryString = require("query-string");

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
    PaymentModal,
    ModalRouter,
    CreateStoryModal,
    StoryInput
  },
  mixins: [ColorScheme],
  data() {
    return {
      showToast: false
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
      return this.$store.state.profile.fetchLoading;
    },
    error() {
      return !!this.$store.state.global.error;
    },
    cssName() {
      return this.$route.meta.cssName;
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
        const html = document.getElementsByTagName("html")[0];
        html.className = "";
        const bodyClassList = html.classList;
        const classList = rootClasses[cssName] || [];
        for (let cls of classList) {
          bodyClassList.add(cls);
        }
      }
    }
  },
  created() {
    ws();

    const params = queryString.parse(location.search);
    if (params.code) {
      Cookie.set("code", params.code, {
        path: "/"
      });
    }
  }
};
</script>

<style lang="scss" src="@/styles/main.scss">
</style>
<style lang="scss" src="@/styles/colorScheme.scss">
</style>
<style lang="scss" src="@/styles/team.scss">
</style>
