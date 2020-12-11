<template>
  <div class="payouts-legal-done">
    <div class="PayoutsLegalDoneView">
      <div class="form-title hidden-desktop" v-if="$mq === 'mobile'">
        <div class="inner">
          <span class="semi-transparent">
            Personal Information
          </span>
        </div>
      </div>
      <h1
        class="form-title hidden-mobile settings-title"
        v-if="$mq === 'desktop'"
      >
        Personal Information
      </h1>
      <div class="shadow-block border-top">
        <div class="container">
          <div class="payouts-personal-info">
            <div
              class="form-group form-group_clear-gaps-bottom form-group_with-label item"
            >
              <span class="title">Name</span>
              <span class="value">
                <span class="value__text">
                  {{ legal.firstName }} {{ legal.lastName }}
                </span>
              </span>
            </div>
            <div
              class="form-group form-group_clear-gaps-bottom form-group_with-label item"
            >
              <span class="title">Date of Birth</span>
              <span class="value">
                <span class="value__text">
                  {{ dt(legal.birthDate) }}
                </span>
              </span>
            </div>
            <div
              class="form-group form-group_clear-gaps-bottom form-group_with-label item"
            >
              <span class="title">Legal Type</span>
              <span class="value">
                <span class="value__text">
                  {{ ucFirst(legal.type) }}
                </span>
              </span>
            </div>
            <div
              class="form-group form-group_clear-gaps-bottom form-group_with-label item"
              v-if="!edit"
            >
              <span class="title">Address</span>
              <span class="value value_editable-field">
                <button @click="edit = true" class="btn-address-edit">
                  Edit
                </button>
                <span class="value__text">
                  {{ address }}
                </span>
              </span>
            </div>
            <LegalEdit v-else @cancel="edit = false" />
          </div>
        </div>
      </div>

      <form action="" class="settings-form" v-on:submit.stop.prevent="save">
        <div class="shadow-block border-top" id="is_paid_subscription__wrapper">
          <div class="container">
            <div class="form-group form-group_with-label">
              <label class="form-group-inner subscription">
                <span class="label">Subscription</span>
                <span class="subscription__field field-symbol-currency">
                  <span
                    class="form-field"
                    :class="{
                      'field-invalid': fieldError('subscribePrice')
                    }"
                  >
                    <span class="subscription__per-month">per month</span>
                    <input
                      class="field-gap_currency field-gap_timeunit"
                      type="number"
                      min="0"
                      :max="setMaxPrice"
                      step="0.01"
                      name="subscribePrice"
                      v-model="localUser.subscribePrice"
                      v-validate="'subscription-price'"
                    />
                  </span>
                  <div class="error-info" v-if="fieldError('subscribePrice')">
                    {{ fieldError("subscribePrice") }}
                  </div>
                </span>
              </label>
            </div>
            <div class="form-group-btn form-group-btn_reset-pb-mob">
              <button
                type="submit"
                class="btn lg btn_fix-width saveChanges"
                :disabled="!changed"
              >
                Save
                <template v-if="$mq === 'desktop'">
                  changes
                </template>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Common from "../../common";
import PayoutsCommon from "../common";
import LegalEdit from "./LegalEdit";
import Form from "@/mixins/form";
import { formatWithoutLocalization } from "@/utils/datetime";

export default {
  name: "PayoutSettingsSummeryLegal",
  mixins: [Common, PayoutsCommon, Form],
  components: { LegalEdit },
  data() {
    return {
      edit: false,
      discount: false
    };
  },
  computed: {
    setMaxPrice() {
      return this.user.subscribePrice > 50 ? null : 50;
    }
  },
  methods: {
    dt(date) {
      return formatWithoutLocalization(date);
    },
    ucFirst(name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  }
};
</script>
