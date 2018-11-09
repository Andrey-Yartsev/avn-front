<template>
  <form
    class="tip-form"
    v-on:submit.stop.prevent="send"
  >
    <span role="button" class="btn btn-cancel" @click="$emit('cancel')">Cancel</span>
    <div class="tip-amount-field">
      <input
        name="amount"
        class="tip-amount-input rounded" type="text"
        pattern="\d{1,5}(?:\.\d{0,2})?" maxlength="8"
        placeholder="Enter amount"
        v-model="amount"
      >
    </div>
    <button type="submit" class="btn" :disabled="!amount">Send tip</button>
  </form>
</template>

<script>
export default {
  name: "UserTip",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      amount: ""
    };
  },
  methods: {
    send() {
      this.$store.dispatch("tip/openPaymentModal", {
        user: this.user,
        amount: this.amount
      });
    },
    reset() {
      this.amount = "";
    }
  }
};
</script>
