<template>
  <div class="main-container">


    <Loader v-if="loading"/>
    <template v-else>

      <Header/>
      <main id="content">
        <router-view></router-view>
      </main>
      <Sidebar v-if="user"/>
      <Toast v-if="showToast" @hide="showToast = false" />

      <ErrorModal v-if="error" />
      <PostModal v-if="this.$store.state.modal.post.show" />
      <PostReportModal v-if="this.$store.state.modal.postReport.show" />
      <ChatModal v-if="this.$store.state.modal.messages.show" />
      <UserReportModal v-if="this.$store.state.modal.userReport.show" />

      <modal-router/>
    </template>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import Header from "@/components/header/Index";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/common/Toast";
import ErrorModal from "@/components/modal/Error";
import PostModal from "@/components/post/ModalView";
import PostReportModal from "@/components/common/postParts/reportModal/Index";
import ChatModal from "@/components/chat/Modal";
import ColorScheme from "@/mixins/colorScheme";
import UserReportModal from "@/components/common/UserReportModal";
import ModalRouter from "@/components/modal/Router";
import ws from "@/ws";

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
    ModalRouter
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
      return this.$store.state.profile.fetchLoading;
    },
    error() {
      return !!this.$store.state.global.error;
    }
  },
  watch: {
    toastShowTrigger() {
      this.showToast = true;
    },
    $route() {
      this.initBodyClass();
      this.$store.dispatch("modal/hideAll");
    }
  },
  methods: {
    initBodyClass() {
      const bodyClassList = document.getElementsByTagName("body")[0].classList;
      if (this.$route.name === "profile") {
        bodyClassList.add("profile-page");
      } else {
        bodyClassList.remove("profile-page");
      }
    }
  },
  created() {
    this.initBodyClass();
    ws();
  }
};
</script>

<style lang="scss" src="@/styles/main.scss">
</style>
<style lang="scss" src="@/styles/colorScheme.scss">
</style>
<style lang="scss" src="@/styles/team.scss">
</style>
