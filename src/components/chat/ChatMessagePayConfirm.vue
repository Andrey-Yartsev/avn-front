<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <div class="loader-container loader-container_center" v-if="progress">
          <Loader :fullscreen="false" text="" :small="true" />
        </div>
        <template v-else>
          <div class="popup-alert__title">
            Pay to view
          </div>
          <div class="popup-alert__body">
            You are opening message for {{ data.price }}
          </div>
          <div class="popup-alert__footer">
            <button class="btn" @click.prevent="yes">Confirm</button>
            <button class="btn alt" @click.prevent="no">Cancel</button>
          </div>
        </template>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import PayAction from "@/mixins/payAction";
import Loader from "@/components/common/Loader";

export default {
  name: "ChatMessagePayConfirm",
  mixins: [PayAction],
  components: {
    Modal,
    Loader
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
      };
      const amount = parseInt(this.data.price.replace(/\$/, "") * 100) / 100;
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
