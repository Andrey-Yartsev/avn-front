<template>
  <div class="payouts-legal">
    <div class="PayoutsLegalProcessingView">
      <h1 class="form-title">Personal Information</h1>
      <div class="border-top shadow-block shadow-block_reset-pt">
        <div class="container">
          <div class="payouts-personal-info">
            <div class="item">
              <span class="title">Name</span>
              <span class="value">
                <span class="value__text"
                  >{{ legal.firstName }} {{ legal.lastName }}</span
                >
              </span>
            </div>
            <div class="item">
              <span class="title">Address</span>
              <span class="value">
                <span class="value__text">{{ address }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <h2 class="form-title text-waiting">
        Account verification in progress, please allow 24 - 48 hours
      </h2>
    </div>
  </div>
</template>

<script>
import SettingsCommonMixin from "@/mixins/settings/common";
import PyoutsMixin from "@/components/pages/settings/payouts/mixins/common";

export default {
  mixins: [SettingsCommonMixin, PyoutsMixin],
  mounted() {
    this.$emit("titleChanged", "Personal Information");
  }
};
</script>
