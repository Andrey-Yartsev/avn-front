<template>
  <form class="tip-form" v-on:submit.stop.prevent="send">
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
          type="number"
          :placeholder="'$' + limits.min + '—' + limits.max"
          v-model="amount"
          :class="{
            error: fieldError('amount'),
            lg: $mq === 'desktop' && needLgClassName
          }"
          v-validate="'tip-amount'"
        />
        <div
          class="tooltip tooltip_error-field"
          x-placement="top"
          aria-hidden="true"
          v-if="fieldError('amount')"
        >
          <div class="tooltip-arrow"></div>
          <div class="tooltip-inner">
            {{ fieldError('amount') }}
          </div>
        </div>
      </div>
    </div>
    <button
      type="submit"
      class="btn btn-submit"
      :disabled="!isFormValid || !canSend"
      :class="{
        lg: $mq === 'desktop' && needLgClassName,
        'btn_white btn_white-alfabg': needLgClassName
      }"
    >
      Send funds
    </button>
  </form>
</template>

<script>
import Form from "@/mixins/form";
import Store from "@/store";
import { Validator } from "vee-validate";

const validLimits = amount => {
  const limits = Store.state.init.data.payments.tipsLimit;
  return amount >= limits.min && amount <= limits.max;
};

Validator.extend("tip-amount", {
  getMessage: () => "Required two numbers past the decimal",
  validate: value => {
    const m = value.toString().match(/^\d+\.(\d+)?$/);
    if (!m) {
      return validLimits(value);
    }
    if (m[1].length === 2) {
      return validLimits(value);
    } else {
      return false;
    }
  }
});

const isFloat = function(number) {
  number = parseFloat(number);
  if (Number.isInteger(number)) {
    return true;
  }
  return number % 1 != 0;
};

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
    }
  },
  data() {
    return {
      amount: ""
    };
  },
  computed: {
    paymentComplete() {
      return this.$store.state.payment.pay.complete;
    },
    limits() {
      return this.$store.state.init.data.payments.tipsLimit;
    },
    isValid() {
      if (!this.amount) {
        return true;
      }
      if (!isFloat(this.amount)) {
        return false;
      }
      return this.amount >= this.limits.min && this.amount <= this.limits.max;
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
    }
  }
};
</script>
