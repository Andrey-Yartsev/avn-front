<template>
  <div class="rounded-container rounded-container_fluid-height">
    <h1 class="form-title hidden-mobile">
      Credits
      <span>Balance: {{ user.creditBalance }} credits</span>
    </h1>

    <form v-on:submit.stop.prevent="deposit">
      <div class="border-top">
        <div class="shadow-block">
          <div class="container">
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">
                  Credits
                  <span class="hidden-desktop"
                    >Balance: {{ user.creditBalance }} credits</span
                  >
                </span>
                <span class="form-group form-group_clear-gaps">
                  <span class="form-field subscription__field">
                    <input
                      name="amount"
                      v-model="amount"
                      class="subscription__input"
                    />
                  </span>
                </span>
              </label>
            </div>
            <div class="form-group-btn">
              <button
                type="submit"
                :disabled="!amount || progress"
                class="btn lg btn_fix-width"
              >
                Deposit
              </button>
              <div
                class="lds-dual-ring transparent inline"
                v-if="progress"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <Transactions />
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import Transactions from "./Transactions";
import PayAction from "./payAction";
import userMixin from "@/mixins/user";

// import PayAction from "../../../../sep-components/avn/securionpay/payAction";

export default {
  name: "CreditsSettingsContent",
  mixins: [PayAction, userMixin],
  components: {
    Loader,
    Transactions
  },
  data() {
    return {
      amount: ""
    };
  },
  methods: {
    deposit() {
      const { paymentGateCustomerCardToken } = this.user;
      this._pay(
        {
          paymentType: "credit",
          amount: parseFloat(this.amount),
          paymentGateCustomerCardToken
        },
        () => {
          this.amount = "";
          this.$store.dispatch("credits/transactions/fetch");
          this.$store.dispatch("profile/fetchSilent");
          this.$store.dispatch(
            "global/flashToast",
            "Deposit is made successfully"
          );
        }
      );
    }
  }
};
</script>
