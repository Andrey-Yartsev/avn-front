<template>
  <div>
    <div class="form-title" :class="{ 'border-top': $mq === 'desktop' }">
      <div class="inner form-group form-group_clear-gaps option-star">
        <label class="toggle-label semi-transparent" for="im_star">
          Auto Reload
          <p class="subtext">
            Automatically reload credit balance when it reaches selected amount
          </p>
        </label>
        <label class="toggle-element">
          <input
            type="checkbox"
            id="im_star"
            name="isWantEarn"
            @change="save"
            :disabled="dataEmpty"
            v-model="on"
          />
          <span class="toggle-element_switcher"></span>
        </label>
      </div>
    </div>
    <div class="shadow-block">
      <div class="container">
        <div class="form-group form-group_with-label">
          <label class="form-group-inner">
            <span class="label">Reload amount</span>
            <span class="form-group form-group_clear-gaps">
              <span class="form-field field-symbol-currency">
                <span class="form-field">
                  <div class="select-wrapper">
                    <select
                      name="reloadAmount"
                      class="default-disabled"
                      v-model="reloadAmount"
                    >
                      <option
                        v-for="value in reloadOptions"
                        :value="value"
                        :key="value"
                      >
                        {{ value }}
                      </option>
                    </select>
                  </div>
                </span>
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>
    <!-- <div class="shadow-block">
      <div class="container">
        <div class="form-group form-group_with-label">
          <label class="form-group-inner">
            <span class="label">Minimal credit balance</span>
            <div class="row">
              <div class="col-1-2">
                <div class="select-wrapper">
                  <select
                    name="minAmount"
                    class="default-disabled"
                    v-model="minAmount"
                  >
                    <option
                      v-for="value in minOptions"
                      :value="value"
                      :key="value"
                    >
                      {{ value }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div> -->
    <div class="shadow-block">
      <div class="container">
        <div class="form-group form-group_with-label">
          <label class="form-group-inner">
            <span class="label">Minimal credit balance</span>
            <span class="form-group form-group_clear-gaps">
              <span class="form-field field-symbol-currency">
                <span class="form-field">
                  <div class="select-wrapper">
                    <select
                      name="minAmount"
                      class="default-disabled"
                      v-model="minAmount"
                    >
                      <option
                        v-for="value in minOptions"
                        :value="value"
                        :key="value"
                      >
                        {{ value }}
                      </option>
                    </select>
                  </div>
                </span>
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import PayAction from "./payAction";
import userMixin from "@/mixins/user";

// import PayAction from "../../../../sep-components/avn/securionpay/payAction";

export default {
  name: "AutoReloadDeposit",
  mixins: [PayAction, userMixin],
  components: {
    Loader
  },
  data() {
    return {
      on: false,
      reloadAmount: 0,
      reloadOptions: [40, 50, 60],
      minAmount: 20,
      minOptions: [20, 30, 40, 50]
    };
  },
  computed: {
    dataEmpty() {
      return !this.reloadAmount || !this.minAmount;
    }
  },
  methods: {
    save() {},
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
          this.$store.dispatch("global/flashToast", {
            text: "Deposit is made successfully"
          });
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
select {
  padding-left: 25px;
}
</style>
