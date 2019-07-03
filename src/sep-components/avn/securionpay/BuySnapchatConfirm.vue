<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <Loader
          v-if="progress"
          :fullscreen="false"
          text=""
          class="transparent small no-text"
        />
        <template v-else>
          <div class="popup-alert__title">
            Pay to view
          </div>
          <div class="popup-alert__body">
            You are opening snapchat for {{ data.price }}
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
import PayAction from "./payAction";
import Loader from "@/components/common/Loader";

export default {
  name: "BuySnapchatConfirm",
  mixins: [PayAction],
  components: {
    Modal,
    Loader
  },
  computed: {
    data() {
      return this.$store.state.modal.buySnapchatConfirm.data;
    }
  },
  methods: {
    yes() {
      const onSuccess = () => {
        this.close();
        this.data.callback && this.data.callback();
      };
      const amount = parseInt(this.data.price.replace(/\$/, "") * 100) / 100;
      this._pay(
        {
          paymentType: this.data.paymentType,
          amount,
          productId: this.data.productId,
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
      this.$store.commit("modal/hideSafe", { name: "buySnapchatConfirm" });
    }
  }
};
</script>
