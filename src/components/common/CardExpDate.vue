<template>
  <span class="expirationDateWrapper">
    <span class="card-date-range">
      <input
        name="expMonth"
        v-model="expDate.expMonth"
        type="text"
        size="2"
        minlength="2"
        maxlength="2"
        data-securionpay="expMonth"
        @input="$emit('input', expDate)"
      />
      <span class="separator">/</span>
      <input
        v-model="expDate.expYear"
        type="text"
        size="4"
        minlength="4"
        maxlength="4"
        data-securionpay="expYear"
        @input="$emit('input', expDate)"
      />
    </span>
  </span>
</template>

<script>
import cardDateValidator from "@/validator/cardDate";

export default {
  name: "CardExpDate",
  data() {
    return {
      expDate: {}
    };
  },
  methods: {
    update() {
      this.$emit("input", Object.assign({}, this.expDate));
    }
  },
  created() {
    this.$validator.extend("card-exp-date", cardDateValidator);
  }
};
</script>
