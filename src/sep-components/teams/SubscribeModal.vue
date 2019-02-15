<template>
  <SubscribeModalInner
    @subscribe="subscribe"
    ref="modal"
    :progress="progress"
  />
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
    };
  },
  computed: {
    profile() {
      return this.$store.state.modal.subscribe.data.user;
    },
    actionPrefix() {
      return this.$store.state.modal.subscribe.data.actionPrefix;
    }
  },
  methods: {
    subscribe() {
      this.progress = true;
      this.$store
        .dispatch("subscription/openPaymentModal", {
          user: this.profile,
          actionPrefix: this.actionPrefix
        })
        .then(() => {
          this.$refs.modal.close();
        });
    }
  }
};
</script>
