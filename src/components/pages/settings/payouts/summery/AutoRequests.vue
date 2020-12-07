<template>
  <div>
    <div class="form-title" :class="{ 'border-top': $mq === 'desktop' }">
      <div
        class="inner form-group form-group_clear-gaps option-star"
        :class="{ disabled: !localUser.autoPayoutsFrequency || isDisabled }"
      >
        <label class="toggle-label semi-transparent" for="im_star">
          Auto Requests
        </label>
        <label class="toggle-element">
          <input
            type="checkbox"
            id="im_star"
            name="isWantEarn"
            :disabled="isDisabled"
            @change="save"
            v-model="localUser.autoPayoutsEnabled"
          />
          <span class="toggle-element_switcher"></span>
        </label>
      </div>
    </div>
    <div class="shadow-block">
      <div class="container">
        <div class="form-group form-group_with-label">
          <label class="form-group-inner">
            <span class="label">Frequency</span>
            <div class="row">
              <div class="col-1-2">
                <div class="select-wrapper">
                  <select
                    name="gender"
                    class="default-disabled"
                    :disabled="localUser.autoPayoutsEnabled"
                    v-model="localUser.autoPayoutsFrequency"
                  >
                    <option :value="'manually'" disabled
                      >Select frequency</option
                    >
                    <option
                      class=""
                      v-for="period in periods"
                      :value="period"
                      :key="period"
                    >
                      {{ periodNames[period] }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SettingsCommonMixin from "@/mixins/settings/common";

const requestsPeriods = ["weekly", "bi-weekly", "monthly"];
const periodNames = {
  weekly: "Weekly",
  "bi-weekly": "Bi weekly",
  monthly: "Monthly"
};

export default {
  name: "AutoRequests",
  mixins: [SettingsCommonMixin],
  data() {
    return {
      periods: requestsPeriods,
      periodNames: periodNames
    };
  },
  computed: {
    isDisabled() {
      return !this.periods.includes(this.localUser.autoPayoutsFrequency);
    }
  }
};
</script>
