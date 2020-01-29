<template>
  <div class="payouts-legal-done">
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
              value="false"
              :disabled="saving"
              v-model="eDelivery"
            />
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
        <div v-if="isDownloadEnabled" class="container">
          <div class="form-group-inner form-group-title downloadFormContainer">
            <a :href="href" download>
              <button
                type="button"
                class="btn btn_reset-mgap alt border btn_fix-width-lg connect-twitter "
                @click="() => {}"
              >
                Download e-Deliver 1099 form
              </button>
            </a>
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
  watch: {
    eDelivery(value) {
      this.saving = true;
      const data = {};
      ["address", "city", "postalCode", "state"].forEach(k => {
        data[k] = this.localLegal[k];
      });
      data.eDelivery = value;

      this.$store.dispatch("payouts/legal/save", data).then(r => {
        if (r.error) {
          return;
        }
        this.$store.dispatch("global/flashToast", {
          text: "Electronic delivery status updated successfully"
        });
        this.saving = false;
      });
    }
  },
  computed: {
    legal() {
      return this.$store.state.payouts.legal.fetchResult;
    },
    href() {
      return "#";
    },
    isDownloadEnabled() {
      return true;
    }
  },
  methods: {
    _clone(o) {
      return JSON.parse(JSON.stringify(o));
    }
  },
  mounted() {
    this.localLegal = this._clone(this.legal);
  }
};
</script>
