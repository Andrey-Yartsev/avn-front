<template>
  <div class="payouts-legal" v-if="!loading">
    <div class="PayoutsLegalView">
      <h1 class="form-title">Premium Links</h1>
      <form class="payouts-legal-form" v-on:submit.stop.prevent="save">
        <div class="border-top shadow-block">
          <div class="container">
            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Snapchat</span>
                <input
                  required
                  v-model="snapchatAccount"
                  v-validate="'required'"
                />
              </label>
            </div>

            <div class="form-group form-group_with-label">
              <label class="form-group-inner">
                <span class="label">Price</span>
                <span class="price__field field-symbol-currency">
                  <input
                    class="field-gap_currency field-gap_timeunit"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    name="snapchatPrice"
                    v-model="snapchatPrice"
                    v-validate="'required'"
                  />
                </span>
              </label>
            </div>
          </div>

          <div class="form-group-btn">
            <button
              type="submit"
              class="btn lg btn_fix-width saveChanges"
              :disabled="!canSave || saving"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Form from "@/mixins/form";

export default {
  name: "PremiumLinksForm",
  mixins: [Form],
  data() {
    return {
      snapchatAccount: "",
      snapchatPrice: "",
      saving: false
    };
  },
  computed: {
    loading() {
      return this.$store.state.premiumLinks.fetchLoading;
    },
    canSave() {
      if (!this.isFormValid) {
        return false;
      }
      return true;
    }
  },
  methods: {
    save() {
      this.saving = true;
      const data = {
        contentType: "snapchat",
        content: this.snapchatAccount,
        price: this.snapchatPrice
      };

      this.$store.dispatch("premiumLinks/save", data).then(r => {
        console.log(r);
        this.$store.dispatch(
          "global/flashToast",
          {
            text: "Changes saved successfully"
          },
          {
            root: true
          }
        );
      });
    }
  },

  mounted() {
    this.$store.commit("premiumLinks/reset");
    this.$store.dispatch("premiumLinks/fetch");
  }
};
</script>
