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
          placeholder="Amount"
          v-model="amount"
        />
      </div>
    </div>
    <button type="submit" class="btn" :disabled="!amount">Send fund</button>
  </form>
</template>

<script>
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
        amount: this.amount,
        tipId: this.tipId
      });
    },
    reset() {
      this.amount = "";
    }
  }
};
</script>
