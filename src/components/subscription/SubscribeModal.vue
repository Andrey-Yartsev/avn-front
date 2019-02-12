<template>
  <Modal :onClose="close">
    <div class="popup-container subscribe-popup" slot="content">
      <div class="content">
        <Content :profile="profile" @subscribe="subscribe">
          <template slot="button-text">
            Subscribe for ${{ profile.subscribePrice }} / month
          </template>
          <template slot="footer-text">
            You will be charged
            <a>${{ profile.subscribePrice }} monthly</a>
            until you cancel your subscription
          </template>
        </Content>
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Content from "./SubscribeModalContent";

export default {
  name: "SubscribeModal",

  components: {
    Modal,
    Content
  },

  computed: {
    profile() {
      return this.$store.state.modal.subscribe.data;
    }
  },

  methods: {
    close() {
      this.$store.commit("modal/hideSafe", { name: "subscribe" });
    },
    subscribe() {
      this.close();
      this.$store.dispatch("subscription/openPaymentModal", this.profile);
    }
  }
};
</script>
