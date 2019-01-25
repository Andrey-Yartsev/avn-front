<template>
  <Modal :onClose="close">
    <div class="popup-container popup-login" slot="content">
      <div class="content">
        <SignupForm type="modal" @openLogin="close" />
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import SignupForm from "@/components/auth/SignupForm";

export default {
  name: "SignupModal",

  components: {
    Modal,
    SignupForm
  },

  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "signup" });
    }
  }
};
</script>
