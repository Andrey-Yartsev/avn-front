<template>
  <SubscribeModalInner @subscribe="subscribe" ref="modal" :progress="progress" />
</template>

<script>
import SubscribeModalInner from "@/components/subscription/SubscribeModalInner";

export default {
  name: "SubscribeModal",
  components: {
    SubscribeModalInner
  },
  data() {
    return {
      progress: false
    }
  },
  computed: {
    profile() {
      return this.$store.state.modal.subscribe.data;
    }
  },
  methods: {
    subscribe() {
      this.progress = true;
      this.$store.dispatch("subscription/openPaymentModal", this.profile).then(() => {
        this.$refs.modal.close();
      });
    }
  }
};
</script>
