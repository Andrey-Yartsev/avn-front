<template>
  <SubscribeModalInner @subscribe="subscribe" ref="modal" />
</template>

<script>
import SubscribeModalInner from "@/components/subscription/SubscribeModalInner";

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
      this.$refs.modal.close();
      this.$store.dispatch("subscription/openPaymentModal", this.profile);
    }
  }
};
</script>
