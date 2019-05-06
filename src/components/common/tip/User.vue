<template>
  <form class="tip-form" v-on:submit.stop.prevent="send">
    <span role="button" class="btn btn-cancel" @click="$emit('cancel')"
      >Cancel</span
    >
    <div class="tip-amount-field form-group form-group_clear-gaps">
      <div class="form-field">
        <input
          name="amount"
          class="tip-amount-input rounded"
          type="text"
          pattern="\d{1,5}(?:\.\d{0,2})?"
          maxlength="8"
          :placeholder="'$' + limits.min + '—' + limits.max"
          v-model="amount"
          :class="{ error: !isValid }"
        />
      </div>
    </div>
    <button type="submit" class="btn" :disabled="!canSend">Send funds</button>
  </form>
</template>

<script>
const isFloat = function(number) {
  number = parseFloat(number);

  console.log(number);

  if (Number.isInteger(number)) {
    return true;
  }
  return number % 1 != 0;
};

export default {
  name: "UserTip",
  props: {
    user: {
      type: Object,
      required: true
    },
    tipId: {
      type: String,
      default: undefined
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
