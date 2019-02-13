<template>
  <Modal :onClose="close">
    <div class="popup-container popup-alert" slot="content">
      <div class="content">
        <div class="popup-alert__title">
          Pay to view
        </div>
        <div class="popup-alert__body">
          You are opening message for {{ data.price }}
        </div>
        <div class="popup-alert__footer">
          <a href="#" class="btn" @click.prevent="yes">Confirm</a>
          <a href="#" class="btn alt" @click.prevent="no">Cancel</a>
        </div>
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import User from "@/mixins/user";

export default {
  name: "SubscriptionConfirmModal",

  mixins: [User],

  components: {
    Modal
  },

  computed: {
    data() {
      return this.$store.state.modal.chatMessagePayConfirm.data;
    }
  },

  methods: {
    yes() {
      this.close();
      this.$store
        .dispatch("payment/pay/pay", {
          paymentType: "message",
          messageId: this.data.messageId,
          amount: this.data.amount,
          paymentGateCustomerCardToken: this.user.paymentGateCustomerCardToken
        })
        .then(() => {
          this.$store.dispatch("chat/fetchMessagesDefault");
        });
    },
    no() {
      this.close();
    },
    close() {
      this.$store.commit("modal/hideSafe", { name: "chatMessagePayConfirm" });
    }
  }
};
</script>

<style scoped>
.content {
  padding: 50px;
  text-align: center;
}
.yes {
  margin-right: 15px;
}
</style>
