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
            Pay to join
          </div>
          <div class="popup-alert__body">
            You are joining to the group for ${{ data.price }}
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
import PayAction from "@/components/pages/settings/payments/payAction";
import Loader from "@/components/common/Loader";

export default {
  name: "GroupPayModal",
  mixins: [PayAction],
  components: {
    Modal,
    Loader
  },
  computed: {
    data() {
      return this.$store.state.modal.groupPayConfirm.data;
    }
  },
  methods: {
    yes() {
      const onSuccess = () => {
        this.$store
          .dispatch("profile/group/joinGroup", {
            productId: this.data.productId
          })
          .then(() => {
            this.close();
          })
          .catch(() => {
            this.close();
          });
      };
      this._pay(
        {
          paymentType: "product",
          productId: this.data.productId,
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
      this.$store.commit("modal/hideSafe", { name: "groupPayConfirm" });
    }
  }
};
</script>
