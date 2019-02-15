<template>
  <SubscribeModalInner
    @subscribe="subscribe"
    :loading="loading"
    :progress="progress"
  />
</template>

<script>
import SubscribeModalInner from "@/components/subscription//SubscribeModalInner";
import User from "@/mixins/user";
import { askFor3dSecure } from "@/utils/3dsecure";

export default {
  name: "SecurionSubscribeModal",
  mixins: [User],
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
      if (!this.user.isPaymentCardConnected) {
        this.$store.dispatch(
          "global/flashToast",
          "You should add card in payment settings"
        );
        return;
      }
      const onSuccess = () => {
        global.location.reload();
      };
      this.progress = true;
      this.$store
        .dispatch("payment/pay/pay", {
          paymentType: "subscribe",
          userId: this.profile.id,
          amount: this.profile.subscribePrice,
          paymentGateCustomerCardToken: this.user.paymentGateCustomerCardToken
        })
        .then(onSuccess)
        .catch(r => {
          if (r.code === 201) {
            askFor3dSecure({
              paymentType: "subscribe",
              userId: this.profile.id,
              amount: this.profile.subscribePrice,
              paymentGateCustomerCardToken: this.user
                .paymentGateCustomerCardToken,
              onSuccess
            });
          } else {
            this.progress = false;
            alert(r);
          }
        });
    }
  },
  mounted() {
    let script = document.createElement("script");
    script.onload = () => {
      this.loading = false;
    };
    script.async = true;
    script.src = "https://securionpay.com/js/securionpay.js";
    document.head.appendChild(script);
  }
};
</script>
