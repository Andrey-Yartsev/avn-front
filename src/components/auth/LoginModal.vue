<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-login"
      :class="{ 'popup-login_no-close': disableClose }"
      slot="content"
    >
      <div class="content content_relative">
        <Logo class="auth-logo header-logo_size" />
        <LoginForm type="modal" @openSignup="_close" />
      </div>
      <button
        v-if="!disableClose"
        type="button"
        class="close close_default close_visible-mob icn-item icn-size_lg"
        @click="close"
      />
      <Footer
        class="site-footer_main"
        v-if="!disableFooter && $mq === 'mobile'"
      />
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import LoginForm from "@/components/auth/LoginForm";
import Footer from "@/components/footer/Index.vue";
import Logo from "@/components/common/Logo";

export default {
  name: "LoginModal",
  components: {
    Modal,
    LoginForm,
    Footer,
    Logo
  },
  computed: {
    disableClose() {
      return !!this.$store.state.modal.login.data.disableClose;
    },
    disableFooter() {
      return !!this.$store.state.modal.login.data.disableFooter;
    }
  },
  methods: {
    close() {
      if (this.disableClose) {
        return;
      }
      this._close();
    },
    _close() {
      this.$store.commit("modal/hideSafe", { name: "login" });
    }
  }
};
</script>
