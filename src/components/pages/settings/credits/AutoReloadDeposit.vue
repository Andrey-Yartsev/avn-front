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
            :disabled="dataEmpty"
            v-model="enabled"
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
                      name="amount"
                      class="default-disabled"
                      v-model="amount"
                    >
                      <option
                        v-for="value in amountOptions"
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
                      name="minLimit"
                      class="default-disabled"
                      v-model="minLimit"
                    >
                      <option
                        v-for="value in minLimitOptions"
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
        <div class="form-group-btn">
          <button
            @click.prevent="save"
            :disabled="!isChanged"
            class="btn lg btn_fix-width"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import PayAction from "./payAction";
import userMixin from "@/mixins/user";

export default {
  name: "AutoReloadDeposit",
  mixins: [PayAction, userMixin],
  components: {
    Loader
  },
  data() {
    return {
      enabled: false,
      amount: 0,
      amountOptions: [20, 50, 100, 200],
      minLimit: 0,
      minLimitOptions: [40, 60, 80, 100],
      initSnapshot: null
    };
  },
  computed: {
    dataEmpty() {
      return !this.amount || !this.minLimit;
    },
    isChanged() {
      if (this.dataEmpty || !this.initSnapshot) {
        return false;
      }
      if (
        this.enabled !== this.initSnapshot.enabled ||
        this.amount !== this.initSnapshot.amount ||
        this.minLimit !== this.initSnapshot.minLimit
      ) {
        return true;
      }
      return false;
    }
  },
  methods: {
    save() {
      this.$store.dispatch("profile/update", this.updatedUser()).then(() => {
        this.initSnapshot = {
          enabled: this.enabled,
          amount: this.amount,
          minLimit: this.minLimit
        };
      });
    },
    updatedUser() {
      const user = this.user;
      user.creditReload = {
        enabled: this.enabled,
        amount: this.amount,
        minLimit: this.minLimit
      };
      return user;
    },
    init() {
      const { enabled, amount, minLimit } = this.user.creditReload;
      this.enabled = enabled;
      this.amount = amount;
      this.minLimit = minLimit;
      this.initSnapshot = { enabled, amount, minLimit };
    }
  },
  mounted() {
    if (this.user.creditReload) {
      this.init();
    } else {
      this.initSnapshot = { enabled: false, amount: 20, minLimit: 40 };
    }
  }
};
</script>

<style lang="scss" scoped>
select {
  padding-left: 25px;
}
</style>
