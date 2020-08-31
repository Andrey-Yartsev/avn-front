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
            Unblock
          </div>
          <div class="popup-alert__body">
            You has been blocked by {{ username }}
            <br />
            You can unblock youself for ${{ blockedPrice }}
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
  name: "PaidUnblock",
  mixins: [PayAction],
  components: {
    Modal,
    Loader
  },
  computed: {
    userId() {
      return this.$store.state.modal.paidUnblock.data.userId;
    },
    username() {
      return this.$store.state.modal.paidUnblock.data.username;
    },
    user() {
      return this.$store.state.auth.user;
    },
    blockedPrice() {
      return this.user.paidBlockedBy.find(item => item.id === this.userId)
        ?.price;
    }
  },
  methods: {
    yes() {
      const onSuccess = () => {
        this.$store.dispatch("global/flashToast", {
          text: "Unblocked successfully"
        });
        const paidBlockedBy = this.removeFromBlocked();
        this.$store.dispatch(
          "auth/extendUser",
          {
            paidBlockedBy
          },
          { root: true }
        );
        this.close();
      };
      this._pay(
        {
          paymentType: "user_unblock",
          userId: this.userId,
          paymentGateCustomerCardToken: this.user.paymentGateCustomerCardToken
        },
        () => onSuccess()
      );
    },
    no() {
      this.close();
    },
    removeFromBlocked() {
      return this.user.paidBlockedBy.filter(item => item.id !== this.userId);
    },
    close() {
      this.progress = false;
      this.$store.commit("modal/hideSafe", { name: "paidUnblock" });
    }
  }
};
</script>
