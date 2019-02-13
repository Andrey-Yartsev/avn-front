<template>
  <SubscribeModalInner />
</template>

<script>
import SubscribeModalInner from "./SubscribeModalInner";

export default {
  name: "SubscribeModal",
  components: {
    SubscribeModalInner
  },
  computed: {
    profile() {
      return this.$store.state.modal.subscribe.data;
    }
  },
  methods: {
    subscribe() {
      this.close();
      this.$store.dispatch("subscription/openPaymentModal", this.profile);
    }
  }
};
</script>
