<template>
  <div>
    <form class="tip-form" @submit.stop.prevent="send">
      <span
        role="button"
        class="btn btn-cancel"
        :class="{
          lg: $mq === 'desktop' && needLgClassName,
          'btn_white btn_white-alfabg': needLgClassName
        }"
        @click="$emit('cancel')"
        >Cancel</span
      >
      <div class="tip-amount-field form-group form-group_clear-gaps">
        <div class="form-field enabled-tooltip">
          <input
            name="amount"
            class="tip-amount-input rounded"
            type="text"
            :placeholder="'$' + limits.min + '—' + limits.max"
            v-model="amount"
            autocomplete="off"
            :class="{
              error: fieldError('amount'),
              lg: $mq === 'desktop' && needLgClassName
            }"
            v-validate="'tip-sum|tip-amount'"
          />
          <div
            class="tooltip tooltip_error-field"
            x-placement="top"
            aria-hidden="true"
            v-if="fieldError('amount')"
          >
            <div class="tooltip-arrow"></div>
            <div class="tooltip-inner">{{ fieldError("amount") }}</div>
          </div>
        </div>
      </div>
      <button
        type="button"
        @click="send"
        class="btn btn-submit"
        :disabled="!isFormValid || !canSend"
        :class="{
          lg: $mq === 'desktop' && needLgClassName,
          'btn_white btn_white-alfabg': needLgClassName
        }"
      >
        Send tips
      </button>
    </form>
    <div v-if="depositOption && me.isPaymentCardConnected" class="deposit">
      <div class="deposit__balance" :class="{ mobile: $mq === 'mobile' }">
        Credits balance
      </div>
      <form class="tip-form" @submit.stop.prevent="deposit">
        <button
          role="button"
          class="btn btn-cancel btn-submit"
          disabled="true"
          :class="{
            lg: $mq === 'desktop' && needLgClassName,
            'btn_white btn_white-alfabg': needLgClassName
          }"
        >
          $ {{ me.creditBalance }}
        </button>
        <div class="tip-amount-field form-group form-group_clear-gaps">
          <div class="form-field">
            <input
              name="deposit"
              class="tip-amount-input rounded"
              type="number"
              :disabled="depositInProgress"
              v-model="depositAmount"
              autocomplete="off"
              :class="{
                lg: $mq === 'desktop' && needLgClassName
              }"
            />
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-submit"
          :disabled="!depositAmount || depositInProgress"
          :class="{
            lg: $mq === 'desktop' && needLgClassName,
            'btn_white btn_white-alfabg': needLgClassName,
            minWidthButton: $mq === 'mobile',
            minWidthButtonDesktop: $mq === 'desktop'
          }"
        >
          Deposit
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import Form from "@/mixins/form";
import { askFor3dSecure } from "@/utils/3dsecure";
import Router from "@/router";

export default {
  name: "UserTip",
  mixins: [Form],
  props: {
    user: {
      type: Object,
      required: true
    },
    tipId: {
      type: String,
      default: undefined
    },
    needLgClassName: {
      type: Boolean,
      default: false
    },
    depositOption: {
      type: Boolean,
      default: false
    },
    streamer: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      amount: "",
      depositAmount: "",
      depositInProgress: false
    };
  },
  computed: {
    me() {
      return this.$store.state.auth.user;
    },
    validator() {
      return this.$validator;
    },
    paymentComplete() {
      return this.$store.state.payment.pay.complete;
    },
    limits() {
      if (!this.me) {
        return {
          min: 2,
          max: 500
        };
      }
      return this.me.payments.tipsLimit;
    },
    isValid() {
      if (!this.amount) {
        return true;
      }
      if (!this.isFloat(this.amount)) {
        return false;
      }
      return this.validLimits(this.amount);
    },
    canSend() {
      if (this.amount) {
        return this.isValid;
      }
      return false;
    }
  },
  watch: {
    paymentComplete(paymentType) {
      if (paymentType && paymentType === "tip") {
        this.$emit("cancel");
      }
    }
  },
  methods: {
    send() {
      this.$store.dispatch("tip/openPaymentModal", {
        user: this.user,
        amount: parseFloat(this.amount),
        tipId: this.tipId
      });
    },
    reset() {
      this.amount = "";
    },
    validLimits(amount) {
      return amount
        ? amount >= this.limits.min && amount <= this.limits.max
        : false;
    },
    isFloat(number) {
      number = parseFloat(number);
      if (Number.isInteger(number)) {
        return true;
      }
      return number % 1 != 0;
    },
    _pay(payload, _onSuccess) {
      if (!this.me.isPaymentCardConnected) {
        this.$store.dispatch("global/flashToast", {
          text: "You should add card in payment settings",
          type: "success"
        });
        Router.push("/settings/payments");
        return;
      }
      const onSuccess = () => {
        this.depositInProgress = false;
        this.$store.dispatch("payment/pay/complete", payload.paymentType);
        _onSuccess();
      };
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
            this._error(r);
          }
        });
    },
    _error(error) {
      this.depositInProgress = false;
      this.depositAmount = "";
      this.$store.dispatch("global/flashToast", {
        text: error.message,
        type: "error"
      });
    },
    deposit() {
      this.depositInProgress = true;
      const { paymentGateCustomerCardToken } = this.me;
      this._pay(
        {
          paymentType: "credit",
          amount: parseFloat(this.depositAmount),
          paymentGateCustomerCardToken
        },
        () => {
          this.depositAmount = "";
          this.$store.dispatch("global/flashToast", {
            text: "Deposit is made successfully"
          });
        }
      );
    }
  },
  mounted() {
    const src = "https://securionpay.com/js/securionpay.js";
    const existedScript = document.head.querySelector(`script[src="${src}"`);
    if (existedScript) {
      return;
    }
    let script = document.createElement("script");
    script.onload = () => {
      this.loading = false;
    };
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  },
  created() {
    this.validator.extend("tip-sum", {
      getMessage: () => {
        return `min: $${this.limits.min}, max: $${this.limits.max}`;
      },
      validate: value => {
        return this.validLimits(parseFloat(value));
      }
    });

    this.validator.extend("tip-amount", {
      getMessage: "Required two numbers past the decimal",
      validate: value => {
        const m = value.toString().match(/^\d+\.(\d+)?$/);
        if (!m) {
          return this.validLimits(value);
        }
        if (!m[1]) {
          return false;
        }
        if (m[1].length === 2) {
          return this.validLimits(value);
        } else {
          return false;
        }
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.deposit {
  &__balance {
    color: white;
    padding: 10px 0 0 20px;
    opacity: 0.8;
    &.mobile {
      padding-left: 0;
    }
  }
}
.minWidthButton {
  min-width: 80px;
}
.minWidthButtonDesktop {
  min-width: 96px;
}
</style>
