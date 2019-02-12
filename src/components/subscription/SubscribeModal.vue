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
import User from "@/mixins/user";

export default {
  name: "SubscribeModal",

  mixins: [User],

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
      if (process.env.VUE_APP_NAME === "avn") {
        if (!this.user.isPaymentCardConnected) {
          this.$store.dispatch(
            "global/flashToast",
            "You should add card in payment settings"
          );
          return;
        }
        this.$store
          .dispatch("payment/pay/pay", {
            paymentType: "subscribe",
            userId: this.profile.id
          })
          .then(() => {
            window.location.reload();
          });
        return;
      }
      this.close();
      this.$store.dispatch("subscription/openPaymentModal", this.profile);
    }
  }
};
</script>
