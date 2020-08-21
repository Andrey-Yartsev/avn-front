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
    <div class="form-group-inner form-tipsGoal__sources">
      <span class="label" :class="{ mobile: $mq === 'mobile' }">Sources:</span>
      <span class="form-group form-group_clear-gaps">
        <span class="form-field">
          <multiselect
            v-model="tipsGoal.sources"
            :options="tipsGoal.sourceTypes"
            :multiple="true"
            :close-on-select="true"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="Add source"
            label="title"
            track-by="value"
          >
            <template slot="selection" slot-scope="{ values, search, isOpen }"
              ><span
                class="multiselect__single"
                v-if="tipsGoal.sources.length &amp;&amp; !isOpen"
                >{{ tipsGoal.sources.length }} sources selected</span
              ></template
            >
          </multiselect>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
  name: "TipsGoalForm",
  components: {
    Multiselect
  },
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
