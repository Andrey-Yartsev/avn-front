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
            You are opening video for ${{ data.price.toFixed(2) }}
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
  name: "MediaPayModal",
  mixins: [PayAction],
  components: {
    Modal,
    Loader
  },
  computed: {
    data() {
      return this.$store.state.modal.mediaPayConfirm.data;
    }
  },
  methods: {
    yes() {
      const onSuccess = () => {
        this.$store
          .dispatch("profile/media/getMediaItem", {
            productId: this.data.messageId
          })
          .then(() => {
            this.close();
          })
          .catch(() => {
            this.close();
          });
      };
      // const amount = parseInt(this.data.price.replace(/\$/, "") * 100) / 100;
      this._pay(
        {
          paymentType: "product",
          productId: this.data.messageId,
          amount: this.data.price,
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
      this.$store.commit("modal/hideSafe", { name: "mediaPayConfirm" });
    }
  }
};
</script>
