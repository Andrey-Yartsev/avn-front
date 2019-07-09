<template>
  <Modal :onClose="close">
    <div
      class="popup-container popup-container_block popup-alert"
      slot="content"
    >
      <div class="content">
        <Loader v-if="progress" :fullscreen="false" text="" class="small" />
        <template v-else>
          <div class="popup-alert__title">
            Fund user
          </div>
          <div class="popup-alert__body">
            You are funding user {{ data.user.name }} for ${{ data.amount }}
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
  name: "TipPayConfirm",
  mixins: [PayAction],
  components: {
    Modal,
    Loader
  },
  computed: {
    data() {
      return this.$store.state.modal.tipPayConfirm.data;
    }
  },
  methods: {
    yes() {
      const onSuccess = data => {
        this.$store.dispatch("global/flashToast", {
          text: "Fund successfully sent"
        });
        this.$store.commit("tip/funded", data);
        this.close();
      };
      const amount = this.data.amount;
      this._pay(
        {
          paymentType: "tip",
          userId: this.data.user.id,
          tipId: this.data.tipId,
          amount,
          paymentGateCustomerCardToken: this.user.paymentGateCustomerCardToken
        },
        () =>
          onSuccess({
            success: true,
            toUserId: this.data.user.id,
            tipId: this.data.tipId,
            amount
          })
      );
    },
    no() {
      this.close();
    },
    close() {
      this.progress = false;
      this.$store.commit("modal/hideSafe", { name: "tipPayConfirm" });
    }
  }
};
</script>
