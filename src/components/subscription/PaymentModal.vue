<template>
  <Modal :onClose="close">
    <div class="popup-container popup-payment" slot="content">
      <div class="content">
        <div class="paymentView">
          <div class="iframe-container">
            <iframe
              :src="link" frameborder="0" width="100%" height="100%"></iframe>
          </div>
        </div>
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";

export default {
  name: "PaymentModal",

  components: {
    Modal
  },

  computed: {
    link() {
      return this.$store.state.subscription.paymentLink;
    }
  },

  methods: {
    close() {
      this.$store.dispatch("modal/hide", { name: "payment" });
      window.location.reload();
    }
  }
};
</script>
