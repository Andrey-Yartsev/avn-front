<template>
  <div class="payouts-bank-done">
    <div id="is_paid_subscription__wrapper" class="border-top">
      <!-- <div :class="{container: $mq === 'mobile'}"> -->
      <div>
        <div class="form-group form-group_with-label">
          <div
            class="form-title"
            :class="{
              'form-title_psides-reset toggle-wrapper': this.$mq === 'mobile'
            }"
          >
            <div class="inner">
              <div class="semi-transparent">
                Subscription Discount
              </div>
            </div>
          </div>
          <div :class="{ 'container shadow-block': $mq === 'mobile' }">
            <form class="payouts-legal-form" @submit.stop.prevent="save">
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
                      :disabled="isEnabled"
                      name="subscribeDiscount"
                      v-model="discount.amount"
                    />
                  </span>
                </span>
              </label>
              <label
                v-if="discount.amount"
                class="form-group-inner subscription"
                :class="{ 'mobile-view': this.$mq === 'mobile' }"
              >
                <span class="label">Computed price</span>
                <span
                  class="label_computedDiscount"
                  v-if="isDiscountInputCorrect"
                  >$ {{ getComputedPrice }}</span
                >
                <span v-else class="label_computedDiscount-error"
                  >Please, enter the correct discount value</span
                >
              </label>
              <label class="form-group-inner subscription discountField">
                <span class="label">Discount limit</span>
                <span class="subscription__field ">
                  <span class="form-field">
                    <input
                      class="field-gap_currency field-gap_timeunit"
                      type="number"
                      min="0"
                      step="1"
                      :disabled="isEnabled"
                      name="subscribeDiscount"
                      v-model="discount.limit"
                    />
                    <sup>
                      *Number of available subscriptions by discount price
                    </sup>
                  </span>
                </span>
              </label>
              <label
                class="form-group-inner subscription"
                :class="{ 'mobile-view': this.$mq === 'mobile' }"
              >
                <span class="label">Expiration date</span>
                <span v-if="discount.period.to" class="label_computedDiscount">
                  {{ getTime }}</span
                >
                <span class="" v-else>Date not selected</span>
              </label>
              <div
                class="post-datetime"
                :class="{ 'post-datetime-mobile': this.$mq === 'mobile' }"
              >
                <div v-if="isEnabled" class="blocker" />
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
              <span
                class="form-group-inner subscription"
                :class="{ 'mobile-view': this.$mq === 'mobile' }"
              >
                <span class="label">Discount enabled</span>
                <label class="toggle-element">
                  <input
                    type="checkbox"
                    name="isStreamsTweet"
                    :disabled="isSwitcherDisabled"
                    v-model="isEnabled"
                    :value="isEnabled"
                    @change="change"
                  />
                  <span
                    class="toggle-element_switcher"
                    :class="{ disabled: isSwitcherDisabled }"
                  />
                </label>
              </span>
            </form>
            <div
              v-if="isEnabled"
              class="buttonWrapper"
              :class="{ withMargin: this.$mq === 'desktop' }"
            >
              <button
                type="button"
                class="btn btn_reset-mgap alt border btn_fix-width-lg connect-twitter"
                @click="informSubscribers"
                :disabled="informed"
              >
                Inform expired subscribers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Datetime } from "vue-datetime";
import { DateTime as LuxonDateTime } from "luxon";
import moment from "moment";
import States from "../payouts/states";
import Form from "@/mixins/form";
import PayoutsCommon from "../common";

export default {
  name: "Discount",
  mixins: [States, PayoutsCommon, Form],
  components: { Datetime },
  data() {
    return {
      discount: {
        target: "subscription",
        type: "percent",
        limit: "",
        amount: "",
        period: {
          from: "",
          to: ""
        }
      },
      saving: false,
      isEnabled: false,
      informed: false
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
      return (
        !this.isDiscountInputCorrect ||
        !this.discount.period.to ||
        (moment(this.discount.period.to).valueOf() < Date.now() &&
          !this.isEnabled)
      );
    },
    isDiscountInputCorrect() {
      if (
        !this.discount.amount ||
        !parseFloat(this.discount.amount) ||
        parseFloat(this.discount.amount) >= 100
      ) {
        return false;
      }
      return true;
    },
    getComputedPrice() {
      return (
        this.currentSubscribtionPrice -
        (this.currentSubscribtionPrice / 100) * this.discount.amount
      ).toFixed(2);
    }
  },
  methods: {
    str2bool(value) {
      if (value && typeof value === "string") {
        if (value.toLowerCase() === "true") return true;
        if (value.toLowerCase() === "false") return false;
      }
      return value;
    },
    change(event) {
      const value = this.str2bool(event.target.value);
      this.$nextTick(() => {
        this.save(value);
      });
    },
    save(disable) {
      this.saving = true;

      const data = { ...this.$store.state.auth.user };
      if (disable) {
        data.discount = {
          ...this.discount,
          isActive: false
        };
      } else {
        data.discount = {
          ...this.discount,
          isActive: true,
          limit: this.discount.limit ? parseInt(this.discount.limit) : 0,
          period: {
            ...this.discount.period,
            from: this.discount.period.from || new Date().toISOString()
          }
        };
      }
      // console.log(data.discount);
      this.$store.dispatch("profile/update", data).then(() => {
        if (disable) {
          this.informed = false;
        }
        this.saving = false;
      });
    },
    init() {
      if (!this.$store.state.auth.user.discount) {
        return;
      }
      const {
        amount,
        period: { from, to },
        isActive,
        limit
      } = this.$store.state.auth.user.discount;
      this.isEnabled = isActive;
      this.discount.limit = limit;
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
    },
    async informSubscribers() {
      const body = {
        price: 0,
        text:
          "Get exclusive subscription price for <b>$" +
          this.getComputedPrice +
          "</b> only till " +
          this.getTime,
        recipients: "expired"
      };
      try {
        await this.$store.dispatch("chat/sendGroupMessage", body);
        this.informed = true;
        this.$store.commit("global/toastShowTrigger", {
          text: "Group message has sent",
          type: "success"
        });
      } catch (err) {
        this.$store.commit("global/toastShowTrigger", {
          text: err.message,
          type: "warning"
        });
      }
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.post-datetime {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.disabled {
  opacity: 0.5;
}
.form-title {
  padding-right: 0;
}
.border-top {
  padding-top: 0;
}
.buttonWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
  padding-bottom: 10px;
  &.withMargin {
    margin-right: -11.5%;
  }
}
.label_computedDiscount {
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  color: #2196f3;
}
.label_computedDiscount-error {
  color: red;
}
.subscription {
  align-items: center;
  &.discountField {
    align-items: flex-start;
  }
}
.mobile-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px 6px;
  .label {
    padding: 0;
  }
}
.post-datetime-mobile {
  padding: 5px 0;
  justify-content: center;
}
.blocker {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  opacity: 0.5;
  z-index: 100;
}
.toggle-wrapper {
  border-bottom: none;
}
</style>
