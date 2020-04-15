export default {
  data() {
    return {};
  },
  computed: {
    tipRouteParam() {
      return this.$route.params.tipAmount;
    },
    onTipRouteAction() {
      return this.$store.state.profile.home.onTipRouteAction;
    }
  },
  methods: {
    autoTipsRoute() {
      return this.tipRouteParam || this.onTipRouteAction;
    },
    clearOnTipRouteAction() {
      this.$store.commit("profile/home/resetOnTipRouteAction");
    },
    setOnTipRouteAction() {
      this.$store.commit("profile/home/setOnTipRouteAction", {
        name: "tipAuto",
        amount: this.tipRouteParam
      });
    },
    openTipModal() {
      const amount = this.tipRouteParam || this.onTipRouteAction.amount;

      this.$store.dispatch("tip/openPaymentModal", {
        user: this.profile,
        amount: parseFloat(amount)
      });

      if (this.tipRouteParam && !this.onTipRouteAction) {
        this.setOnTipRouteAction();
      } else if (!this.tipRouteParam && this.onTipRouteAction) {
        this.clearOnTipRouteAction();
      }
    }
  },
  mounted() {
    if (this.tipRouteParam && !this.user) {
      this.$store.dispatch("modal/show", { name: "login" });
      return;
    }
    if (this.autoTipsRoute()) {
      this.openTipModal();
    }
  }
};
