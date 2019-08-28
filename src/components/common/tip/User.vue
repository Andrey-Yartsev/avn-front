<template>
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
</template>

<script>
import Form from "@/mixins/form";

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
    }
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
