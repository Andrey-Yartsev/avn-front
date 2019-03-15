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
                this.close();
                alert(error.message);
              }
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
