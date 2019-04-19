<template>
  <Modal :onClose="close">
    <div class="popup-container popup-login" slot="content">
      <div class="content content_relative">
        <SignupForm type="modal" @openLogin="close" />
      </div>
      <button
        type="button"
        class="close close_default close_visible-mob"
        @click="close"
      ></button>
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
