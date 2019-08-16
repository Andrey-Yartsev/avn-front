<template>
  <Modal :onClose="close">
    <div class="popup-container popup-login" slot="content">
      <div class="content content_relative">
        <LoginForm type="modal" @openSignup="close" />
      </div>
      <button
        type="button"
        class="close close_default close_visible-mob icn-item icn-size_lg"
        @click="close"
      />
      <Footer class="site-footer_main" v-if="$mq === 'mobile'" />
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import LoginForm from "@/components/auth/LoginForm";
import Footer from "@/components/footer/Index.vue";

export default {
  name: "LoginModal",
  components: {
    Modal,
    LoginForm,
    Footer
  },
  methods: {
    close() {
      this.$store.commit("modal/hideSafe", { name: "login" });
    }
  }
};
</script>
