<template>
  <Modal :onClose="close">
    <div class="popup-container popup-alert" slot="content">
      <div class="content">
        <Loader
          v-if="progress"
          :fullscreen="false"
          text=""
          class="transparent small"
        />
        <template v-else>
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
        </template>
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import PayAction from "./payAction";
import Loader from "@/components/common/Loader";

export default {
  name: "ChatMessagePayConfirm",
  mixins: [PayAction],
  components: {
    Modal,
    Loader
  },
  data() {
    return {
      progress: false
    };
  },
  computed: {
    data() {
      return this.$store.state.modal.chatMessagePayConfirm.data;
    }
  },
  methods: {
    yes() {
      const onSuccess = () => {
        this.close();
        this.$store.dispatch("chat/fetchMessagesDefault");
      };
      const amount = parseInt(this.data.price.replace(/\$/, ""));
      this._pay(
        {
          paymentType: "message",
          messageId: this.data.messageId,
          amount,
          paymentGateCustomerCardToken: this.user.paymentGateCustomerCardToken
        },
        onSuccess
      );
    },
    no() {
      this.close();
    },
    close() {
      this.progress = false;
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
