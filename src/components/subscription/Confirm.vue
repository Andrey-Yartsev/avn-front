<template>
  <Modal :onClose="close">
    <div class="popup-container popup-alert" slot="content">
      <div class="content">
        <div class="popup-alert__title">
          You are about to unsubscribe from {{ user.name }}?
        </div>
        <div class="popup-alert__body">
          You will be able to resubscribe during current billing period without
          any additional costs.
        </div>
        <div class="popup-alert__footer">
          <button class="btn alt" @click.prevent="no" :disabled="progress">
            Cancel
          </button>
          <button class="btn" @click.prevent="yes" :disabled="progress">
            Unsubscribe
          </button>
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

  data() {
    return {
      progress: false
    };
  },

  computed: {
    user() {
      return this.$store.state.modal.subscriptionConfirm.data;
    }
  },

  methods: {
    yes() {
      this.progress = true;
      this.$store
        .dispatch("subscription/unsubscribe", {
          userId: this.user.id
        })
        .then(() => {
          this.$store.commit("subscription/confirm/yes", this.user.id);
          this.$store.commit("modal/hideSafe", { name: "subscriptionConfirm" });
        });
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
