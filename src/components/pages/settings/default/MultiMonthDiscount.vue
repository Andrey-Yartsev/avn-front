<template>
  <div class="payouts-bank-done">
    <div id="is_paid_subscription__wrapper" class="border-top">
      <div>
        <div class="form-group form-group_with-label">
          <div
            class="form-title"
            :class="{
              'form-title_psides-reset toggle-wrapper': $mq === 'mobile'
            }"
          >
            <div class="inner">
              <div class="semi-transparent">
                Multi-month subscription
              </div>
            </div>
          </div>
          <div :class="{ 'container shadow-block': $mq === 'mobile' }">
            <form class="payouts-legal-form">
              <span
                v-for="(month, i) in localUser.multiMonthSubscription"
                :key="i"
                class="form-group-inner subscription"
                :class="{ 'mobile-view': $mq === 'mobile' }"
              >
                <span
                  class="month-switcher"
                  :class="{ 'mobile-view': $mq === 'mobile' }"
                >
                  <span class="label">{{ i }} months</span>
                  <label class="toggle-element">
                    <input
                      type="checkbox"
                      name="isStreamsTweet"
                      v-model="localUser.multiMonthSubscription[i].isEnabled"
                    />
                    <span class="toggle-element_switcher" />
                  </label>
                </span>
                <label class="form-group-inner discount">
                  <span class="label">Discount</span>
                  <span class="subscription__field field-symbol-percentage">
                    <span class="form-field">
                      <span class="subscription__per-month"
                        >from ${{ getSubscriptionPrice(i) }}</span
                      >
                      <input
                        class="field-gap_currency field-gap_timeunit"
                        type="number"
                        min="0"
                        :max="100"
                        step="0.01"
                        name="subscribeDiscount"
                        v-model="localUser.multiMonthSubscription[i].discount"
                      />
                    </span>
                  </span>
                </label>
              </span>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MultiMonthDiscount",
  props: {
    localUser: {
      type: Object,
      required: true
    }
  },

  computed: {
    currentSubscribtionPrice() {
      return this.$store.state.auth.user.subscribePrice;
    }
  },
  methods: {
    getSubscriptionPrice(months) {
      return (
        parseInt(months) * parseFloat(this.currentSubscribtionPrice)
      ).toFixed(2);
    }
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
.discount {
  margin: 0 0 0 auto;
}
.month-switcher {
  width: 30%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  .toggle-element {
    margin-left: 10px;
  }
  &.mobile-view {
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 0;
    .label {
      width: 100%;
    }
    .toggle-element {
      margin-left: 0;
    }
  }
}
</style>
