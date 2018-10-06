<template>
	<div>
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
		</template>
	</div>
</template>

<script>
import Loader from "./components/common/Loader";
import Header from "./components/header/Index";
import Sidebar from "./components/Sidebar";
import Toast from "./components/common/Toast";
import ColorScheme from "@/mixins/colorScheme";

import ErrorModal from "@/components/modal/Error";
import PostModal from "@/components/common/postModal/Index";
import PostReportModal from "@/components/common/post/reportModal/Index";
import ChatModal from "@/components/chat/Modal";

export default {
  components: {
    Loader,
    Header,
    Sidebar,
    Toast,
    ErrorModal,
    PostReportModal,
    PostModal,
    ChatModal
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
      return this.$store.dispatch("modal/hideAll");
    }
  }
};
</script>

<style lang="scss" src="@/design/css/main.scss">
</style>
<style lang="scss" src="@/design/css/colorScheme.scss">
</style>
<style lang="scss" src="@/design/fonts/team/team.scss">
</style>
