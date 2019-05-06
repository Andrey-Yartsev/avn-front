<template>
  <SubscribeModalInner
    @subscribe="subscribe"
    :loading="loading"
    :progress="progress"
  />
</template>

<script>
import SubscribeModalInner from "@/components/subscription//SubscribeModalInner";
import PayAction from "./payAction";

export default {
  name: "SecurionSubscribeModal",
  mixins: [PayAction],
  components: {
    SubscribeModalInner
  },
  computed: {
    profile() {
      return this.$store.state.modal.subscribe.data.user;
    }
  },
  data() {
    return {
      loading: true,
      progress: false
    };
  },
  methods: {
    subscribe() {
      const onSuccess = () => {
        this.$store.dispatch("subscription/success");
      };
      this._pay(
        {
          paymentType: "subscribe",
          userId: this.profile.id,
          amount: this.profile.subscribePrice,
          paymentGateCustomerCardToken: this.user.paymentGateCustomerCardToken
        },
        onSuccess
      );
    },
    close() {
      this.$store.commit("modal/hideSafe", { name: "subscribe" });
    }
  }
};
</script>
