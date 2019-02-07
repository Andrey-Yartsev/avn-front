<template>
  <div class="payouts-legal-done">
    <div class="PayoutsLegalDoneView">
      <div class="form-title hidden-desktop">
        <div class="inner">
          <span class="semi-transparent">
            Personal Information
          </span>
        </div>
      </div>
      <h1 class="form-title hidden-mobile" v-if="$mq === 'desktop'">Personal Information</h1>
      <div class="shadow-block border-top">
        <div class="container">
          <div class="payouts-personal-info">
            <div class="item">
              <span class="title">Name</span>
              <span class="value">
                <span class="value__text">
                  {{ legal.firstName }} {{ legal.lastName }}
                </span>
              </span>
            </div>
            <div class="item">
              <span class="title">Date of Birth</span>
              <span class="value">
                <span class="value__text">
                  {{ dt(legal.birthDate) }}
                </span>
              </span>
            </div>
            <div class="item">
              <span class="title">Legal Type</span>
              <span class="value">
                <span class="value__text">
                  {{ ucFirst(legal.type) }}
                </span>
              </span>
            </div>
            <div class="item">
              <span class="title">Address</span>
              <span class="value">
                <span class="value__text">
                  {{ legal.address }}, {{ legal.city }}, {{ legal.postalCode }},
                  {{ legal.state }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <form action="" class="settings-form" v-on:submit.stop.prevent="save">
        <div class="shadow-block border-top" id="is_paid_subscription__wrapper">
          <div class="container">
            <div class="form-group form-group_with-label">
              <label class="form-group-inner subscription">
                <span class="label">Subscription</span>
                <span class="subscription__field">
                  <span class="subscription__per-month">per month</span>
                  <input
                    class="subscription__input"
                    type="number"
                    min="0"
                    name="subscribePrice"
                    v-model="localUser.subscribePrice"
                  />
                </span>
              </label>
            </div>
            <div class="form-group form-group_with-label row-btn-save">
              <div class="form-group-inner">
                <span class="label"></span>
                <button
                  type="submit"
                  class="btn lg saveChanges"
                  :disabled="!changed"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import dateFns from "date-fns";
import Common from "../../common";

export default {
  name: "PayoutSettingsSummeryLegal",

  mixins: [Common],

  computed: {
    legal() {
      return this.$store.state.payouts.legal.fetchResult;
    }
  },

  methods: {
    dt(date) {
      return dateFns.format(new Date(date), "DD MMM YYYY");
    },
    ucFirst(name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  }
};
</script>
