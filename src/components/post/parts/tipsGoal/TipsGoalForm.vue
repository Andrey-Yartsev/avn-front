<template>
  <div class="post-tipsGoal" :class="{ 'mobile-view': $mq === 'mobile' }">
    <div class="post-tipsGoal-form">
      <span
        @click="() => (tipsGoal.isEnabled = false)"
        class="icn-item btn-reset btn-reset_prim-color icn-pos_center close-tipsGoal"
      />
      <div class="form-group form-group_with-label text">
        <label class="form-group-inner">
          <span class="label">Text:</span>
          <span class="form-group form-group_clear-gaps">
            <span class="form-field">
              <input
                class="field-gap_currency"
                type="text"
                name="text"
                v-model="tipsGoal.text"
              />
            </span>
          </span>
        </label>
      </div>
      <div class="form-group form-group_with-label amount">
        <label class="form-group-inner">
          <span class="label">Amount:</span>
          <span class="form-group form-group_clear-gaps field-symbol-currency">
            <span class="form-field">
              <input
                class="field-gap_currency"
                type="number"
                name="amount"
                v-model="tipsGoal.total"
              />
            </span>
          </span>
        </label>
      </div>
      <div class="form-group form-group_with-label sources">
        <div class="form-group-inner">
          <span class="label" :class="{ mobile: $mq === 'mobile' }"
            >Sources:</span
          >
          <span class="form-group form-group_clear-gaps">
            <span class="form-field">
              <multiselect
                v-model="tipsGoal.sources"
                :options="tipsGoalSourceTypes"
                :multiple="true"
                :close-on-select="true"
                :clear-on-select="false"
                :preserve-search="true"
                placeholder="Add source"
                label="title"
                track-by="value"
              >
                <template
                  slot="selection"
                  slot-scope="{ values, search, isOpen }"
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
      type: Object,
      required: true
    },
    tipsGoalSourceTypes: {
      type: Array,
      required: true
    }
  }
};
</script>
