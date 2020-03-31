<template>
  <div class="form-tipsGoal">
    <form class="form-tipsGoal__wrapper">
      <p class="form-tipsGoal__title">Amount:</p>
      <input
        type="number"
        ref="tipsGoalAmmount"
        class="form-comments__input m-amount rounded lg"
        min="0"
        v-model.trim="tipsGoal.amount"
        @keypress.enter.prevent="sendTipGoal"
      />
      <input
        ref="tipsGoalDescription"
        placeholder="Description"
        class="form-comments__input m-description rounded lg"
        maxlength="200"
        v-model.trim="tipsGoal.description"
        @keypress.enter.prevent="sendTipGoal"
      />
      <button
        @click="sendTipGoal"
        type="button"
        class="btn-send btn-send_inside-field icn-item icn-size_lg"
        :disabled="!tipsGoal.amount || !tipsGoal.description"
      ></button>
    </form>
  </div>
</template>

<script>
export default {
  name: "TipsGoalForm",
  props: {
    tipsGoal: {
      type: Object
    },
    sendTipGoal: {
      type: Function
    }
  }
};
</script>
