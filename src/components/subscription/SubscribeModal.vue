<template>
  <SubscribeModalInner
    @subscribe="subscribe"
    :loading="scriptLoading"
    :progress="progress"
  />
</template>

<script>
import SubscribeModalInner from "@/components/subscription//SubscribeModalInner";
import PayAction from "../pages/settings/payments/payAction";

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
    subscribe({ months, price }) {
      const onSuccess = () => {
        this.$store.dispatch("subscription/success");
        if (window.onSubscriptionSuccess) {
          window.onSubscriptionSuccess();
          window.onSubscriptionSuccess = null;
        }
        this.close();
      };
      this._pay(
        {
          paymentType: "subscribe",
          userId: this.profile.id,
          amount: price,
          months: months,
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
