<template>
  <div v-if="href" class="payouts-legal-done">
    <div class="PayoutsLegalDoneView">
      <div class="form-title tweet-posts-block border-top">
        <div class="inner">
          <span class="semi-transparent">
            Electronic Delivery
          </span>
          <label class="toggle-element">
            <input
              type="checkbox"
              name="isStreamsTweet"
              :value="eDelivery"
              :disabled="saving"
              v-model="eDelivery"
              @change="change"
            />
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
        <div v-if="isDownloadEnabled" class="container">
          <div class="form-group-inner form-group-title downloadFormContainer">
            <button
              type="button"
              class="btn btn_reset-mgap alt border btn_fix-width-lg connect-twitter "
              @click="getPdf"
            >
              Open e-Deliver 1099 form
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PayoutsSettingsElectronicDelivery",
  data() {
    return {
      saving: false,
      eDelivery: true,
      localLegal: null
    };
  },
  computed: {
    legal() {
      return this.$store.state.payouts.legal.fetchResult;
    },
    href() {
      return this.$store.state.payouts.legal.fetchResult.eDeliveryUrl;
    },
    isDownloadEnabled() {
      return this.eDelivery;
    }
  },
  methods: {
    _clone(o) {
      return JSON.parse(JSON.stringify(o));
    },
    change(e) {
      this.sendData(!this.str2bool(e.target.value));
    },
    str2bool(value) {
      if (value && typeof value === "string") {
        if (value.toLowerCase() === "true") return true;
        if (value.toLowerCase() === "false") return false;
      }
      return value;
    },
    sendData(value) {
      this.saving = true;
      const data = {};
      ["address", "city", "postalCode", "state"].forEach(k => {
        data[k] = this.localLegal[k];
      });
      data.eDelivery = value;
      data.eDeliveryUrl = this.localLegal.eDeliveryUrl;
      this.$store.dispatch("payouts/legal/save", data).then(r => {
        if (r.error) {
          return;
        }
        this.$store.dispatch("global/flashToast", {
          text: "Electronic delivery status updated successfully"
        });
        this.saving = false;
      });
    },
    getPdf() {
      const token = this.$store.state.auth.token;
      window.open(
        `${process.env.VUE_APP_API_URL}/users/download?access-token=${token}`
      );
    }
  },
  mounted() {
    this.localLegal = this._clone(this.legal);
    this.eDelivery = this.legal.eDelivery;
  }
};
</script>
