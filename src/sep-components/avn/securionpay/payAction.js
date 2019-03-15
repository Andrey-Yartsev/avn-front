import { askFor3dSecure } from "@/utils/3dsecure";
import User from "@/mixins/user";

export default {
  mixins: [User],
  methods: {
    _pay(payload, onSuccess) {
      if (!this.user.isPaymentCardConnected) {
        this.$store.dispatch(
          "global/flashToast",
          "You should add card in payment settings"
        );
        return;
      }
      this.progress = true;
      this.$store
        .dispatch("payment/pay/pay", payload)
        .then(onSuccess)
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
            this.progress = false;
            this._error(r);
          }
        });
    },
    _error(error) {
      this.$store.dispatch("global/flashToast", error.message);
      this.close();
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
