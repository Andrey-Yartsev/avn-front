<template>
  <div class="border-top border-top_reset-bt-desk">
    <div class="form-title form-title_psides-reset">
      <div class="inner">
        <div class="semi-transparent">
          Subscription Discount
        </div>
        <button @click="$emit('cancel')">
          Cancel
        </button>
      </div>
    </div>
    <form class="payouts-legal-form" @submit.stop.prevent="save">
      <div class="form-group form-group_with-label">
        <label class="form-group-inner subscription">
          <span class="label">Discount</span>
          <span class="subscription__field field-symbol-percentage">
            <span class="form-field">
              <span class="subscription__per-month"
                >from ${{ currentSubscribtionPrice }}</span
              >
              <input
                class="field-gap_currency field-gap_timeunit"
                type="number"
                min="0"
                :max="100"
                step="0.01"
                name="subscribeDiscount"
                v-model="discount.amount"
              />
            </span>
          </span>
        </label>
      </div>
      <div class="form-group form-group_with-label" style="padding-bottom: 0">
        <label class="form-group-inner subscription">
          <span class="label">Expiration date</span>
          <span class="subscription__field ">
            <span class="form-field">
              <input
                class="field-gap_currency field-gap_timeunit"
                type="text"
                disabled
                name="subscribeExpiration"
                :value="getTime"
              />
            </span>
          </span>
        </label>
      </div>
      <div class="post-datetime">
        <Datetime
          :inputId="`post-datetime__switcher_${'modal'}`"
          class="post-datetime__switcher"
          type="datetime"
          v-model="discount.period.to"
          input-class="post-datetime__input"
          use12-hour
          :min-datetime="minDate"
          @close="closeDatepicker"
          :phrases="{ ok: 'Set', cancel: 'Cancel' }"
        />
        <span
          class="post-datetime__icn icn-item icn-calendar icn-size_lg"
          @click="openDatepicker"
        ></span>
        <span>
          Set date
        </span>
      </div>
      <div class="form-group form-group_with-label">
        <span class="form-group-inner subscription" style="align-items: center">
          <span class="label">Enable discount</span>
          <label class="toggle-element"
            ><input
              type="checkbox"
              name="isStreamsTweet"
              :disabled="isSwitcherDisabled"
              v-model="isEnabled"/><span
              class="toggle-element_switcher"
              :class="{ disabled: isSwitcherDisabled }"
            ></span
          ></label>
        </span>
      </div>
    </form>
  </div>
</template>

<script>
import { Datetime } from "vue-datetime";
import { DateTime as LuxonDateTime } from "luxon";
import moment from "moment";
import States from "../states";
import Form from "@/mixins/form";
import PayoutsCommon from "../common";

export default {
  name: "LegalDiscount",
  mixins: [States, PayoutsCommon, Form],
  components: { Datetime },
  data() {
    return {
      discount: {
        target: "subscription",
        type: "fixed",
        amount: "",
        period: {
          from: "",
          to: ""
        }
      },
      saving: false,
      isEnabled: false
    };
  },
  computed: {
    currentSubscribtionPrice() {
      return this.$store.state.auth.user.subscribePrice;
    },
    minDate() {
      return LuxonDateTime.local()
        .plus({ minutes: 1 })
        .toISO();
    },
    getTime() {
      if (!this.discount.period.to) {
        return "";
      }
      return moment(this.discount.period.to).format("MMMM Do YYYY, h:mm:ss a");
    },
    isSwitcherDisabled() {
      return !this.discount.amount || !this.discount.period.to;
    }
  },
  methods: {
    save() {
      this.saving = true;

      const data = {};
      ["address", "city", "postalCode", "state"].forEach(k => {
        data[k] = this.localLegal[k];
      });

      this.$store.dispatch("payouts/legal/save", data).then(r => {
        if (r.error) {
          return;
        }
        this.$store.dispatch("global/flashToast", {
          text: "Personal info saved successfully"
        });
        this.saving = false;
        this.$emit("cancel");
      });
    },
    init() {
      if (!this.$store.state.auth.user.discount) {
        return;
      }
      const {
        amount,
        period: { from, to }
      } = this.$store.state.auth.user.discount;
      this.discount.amount = amount;
      this.discount.period.from = from;
      this.discount.period.to = to;
    },
    openDatepicker() {
      document.body.classList.add("open-timepicker");
      document.getElementById(`post-datetime__switcher_${"modal"}`).click();
    },
    closeDatepicker() {
      document.body.classList.remove("open-timepicker");
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.post-datetime {
  padding-right: 11.5%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.disabled {
  opacity: 0.5;
}
</style>
