<template>
  <Modal :onClose="close">
    <div class="popup-container popup-alert" slot="content">
      <div class="content">
        <div class="popup-alert__title">You are about to unsubscribe from {{ user.name }}?</div>
        <div class="popup-alert__body">
          You will be able to resubscribe during current billing period without any additional costs.
        </div>
        <div class="popup-alert__footer">
          <a href="#" class="btn alt" @click.prevent="no">Cancel</a>
          <a href="#" class="btn" @click.prevent="yes">Unsubscribe</a>
        </div>
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";

export default {
  name: "SubscriptionConfirmModal",

  components: {
    Modal
  },

  computed: {
    user() {
      return this.$store.state.modal.subscriptionConfirm.data;
    }
  },

  methods: {
    yes() {
      this.$store.dispatch("subscription/unsubscribe", {
        userId: this.user.id
      });
      this.$store.commit("subscription/confirm/yes", this.user.id);
      this.$store.commit("modal/hideSafe", { name: "subscriptionConfirm" });
    },
    no() {
      this.$store.commit("subscription/confirm/no");
      this.$store.dispatch("modal/hide", { name: "subscriptionConfirm" });
    },
    close() {
      this.$store.commit("subscription/confirm/no");
      this.$store.dispatch("modal/hide", { name: "subscriptionConfirm" });
    }
  },

  mounted() {
    this.$store.commit("subscription/confirm/reset");
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
