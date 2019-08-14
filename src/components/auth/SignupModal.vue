<template>
  <Modal :onClose="close">
    <div class="popup-container popup-login" slot="content">
      <div class="content content_relative">
        <SignupForm type="modal" @openLogin="close" />
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
import SignupForm from "@/components/auth/SignupForm";
import Footer from "@/components/footer/Index.vue";

export default {
  name: "SignupModal",

  components: {
    Modal,
    SignupForm,
    Footer
  },

  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "signup" });
    }
  }
};
</script>
