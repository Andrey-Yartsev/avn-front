<template>
  <div>
    <div class="form-title" :class="{ 'border-top': $mq === 'desktop' }">
      <div
        class="inner form-group form-group_clear-gaps option-star"
        :class="{ disabled: !localUser.autoPayoutsFrequency }"
      >
        <label class="toggle-label semi-transparent" for="im_star">
          Auto Requests
        </label>
        <label class="toggle-element">
          <input
            type="checkbox"
            id="im_star"
            name="isWantEarn"
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
                    v-model="localUser.autoPayoutsFrequency"
                  >
                    <option :value="undefined" disabled
                      >Select frequency</option
                    >
                    <option
                      v-for="period in periods"
                      :value="period"
                      :key="period"
                    >
                      {{ period }}
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
import Common from "../../common";

const requestsPeriods = ["weekly", "bi weekly", "monthly"];

export default {
  name: "AutoRequests",
  mixins: [Common],
  data() {
    return {
      periods: requestsPeriods
    };
  }
};
</script>
