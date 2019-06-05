<template>
  <Modal :onClose="close">
    <div class="popup-container popup-payment" slot="content">
      <div class="content">
        <div class="paymentView">
          <div class="iframe-container">
            <Loader
              :fullscreen="false"
              text=""
              class="transparent"
              v-if="loading"
            />
            <iframe
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              ref="iframe"
              :src="link"
              frameborder="0"
              width="100%"
              height="100%"
            ></iframe>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="close close_default close_visible-mob icn-item"
        @click="close"
      />
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Loader from "@/components/common/Loader";

export default {
  name: "PaymentModal",

  components: {
    Modal,
    Loader
  },

  data() {
    return {
      loading: true
    };
  },

  computed: {
    link() {
      return this.$store.state.subscription.paymentLink;
    }
  },

  methods: {
    close() {
      this.$store.commit("modal/hideSafe", { name: "payment" });
    }
  },

  mounted() {
    this.$refs.iframe.onload = () => {
      this.loading = false;
    };
  }
};
</script>
