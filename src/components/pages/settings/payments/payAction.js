import { askFor3dSecure } from "@/utils/3dsecure";
import User from "@/mixins/user";
// import Router from "@/router";

export default {
  mixins: [User],
  data() {
    return {
      progress: false
    };
  },
  methods: {
    _pay(payload, _onSuccess) {
      // if (!this.user.isPaymentCardConnected) {
      //   this.$store.dispatch("global/flashToast", {
      //     text: "You should add card in payment settings",
      //     type: "warning"
      //   });
      //   this.$store.commit(
      //     "payment/card/setAfterAddCardRedirect",
      //     this.$route.path
      //   );
      //   Router.push("/settings/payments");
      //   return;
      // }
      this.$store.commit("profile/home/resetOnPageAction");
      this.progress = true;
      const onSuccess = () => {
        this.progress = false;
        this.$store.dispatch("payment/pay/complete", payload.paymentType);
        _onSuccess();
      };
      this.$store
        .dispatch("payment/pay/pay", payload)
        .then(res => {
          if (res.success && res.message) {
            this.$store.dispatch("global/flashToast", {
              text: res.message,
              type: "warning"
            });
          }
          onSuccess();
        })
        .catch(r => {
          if (r.code === 201) {
            askFor3dSecure({
              ...payload,
              onSuccess,
              onFailure: error => {
                this._error(error);
              }
            });
          } else {
            this._error(r);
          }
        });
    },
    _error(error) {
      this.progress = false;
      this.$store.dispatch("global/flashToast", {
        text: error.message,
        type: "error"
      });
      if (this.close) {
        this.close();
      }
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
