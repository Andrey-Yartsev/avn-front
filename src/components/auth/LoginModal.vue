<template>
  <Modal :onClose="close">
    <div class="popup-container popup-login" slot="content">
      <div class="content">
        <LoginForm type="modal" @openSignup="close" />
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import LoginForm from "@/components/auth/LoginForm";

export default {
  name: "LoginModal",

  components: {
    Modal,
    LoginForm
  },

  methods: {
    close() {
      this.$store.commit("modal/hideSafe", { name: "login" });
    }
  }
};
</script>
