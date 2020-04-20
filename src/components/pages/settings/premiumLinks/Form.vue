<template>
  <div class="payouts-legal" v-if="!loading">
    <div class="PayoutsLegalView">
      <h1 class="form-title settings-title">Premium Links</h1>
      <form class="payouts-legal-form " v-on:submit.stop.prevent="save">
        <div class="form-title border-top">
          <div class="inner">
            <div class="semi-transparent">
              Snapchat price
            </div>
          </div>
        </div>
        <div class="shadow-block container">
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
                <span
                  class="form-field"
                  :class="{ 'field-invalid': fieldError('price') }"
                >
                  <input
                    class="field-gap_currency"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    name="snapchatPrice"
                    v-model="snapchatPrice"
                    v-validate="'required|subscription-price'"
                  />
                </span>
                <div class="error-info" v-if="fieldError('price')">
                  {{ fieldError("price") }}
                </div>
              </span>
            </label>
          </div>
          <div class="form-group-btn">
            <button
              type="submit"
              class="btn lg btn_fix-width-sm"
              :disabled="!canSave || saving"
            >
              Save
            </button>
            <button
              @click.prevent="deleteSnapchat"
              class="btn alt"
              v-if="snapchatData.id"
              :class="{
                'lg btn_fix-width-sm': $mq === 'desktop',
                deleteSnapchat: $mq === 'mobile'
              }"
            >
              Delete
            </button>
          </div>
        </div>
      </form>
      <form class="payouts-legal-form " v-on:submit.stop.prevent="save">
        <div class="form-title border-top">
          <div class="inner">
            <div class="semi-transparent">
              One-Click Tip Links
              <p class="subtext">
                One-Click Tip links allow you to link directly to a specific
                tip. You can create a tip link in any denomination that you
                would like by specifying the amount you'd like it to be at the
                end of the url.
              </p>
            </div>
          </div>
        </div>
        <div class="shadow-block container">
          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">Tip amount</span>
              <span class="price__field field-symbol-currency">
                <span class="form-field">
                  <input
                    class="field-gap_currency"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    name="tipAmount"
                    v-model="tipAmount"
                    v-validate="'required|subscription-price'"
                  />
                </span>
              </span>
            </label>
          </div>
          <div class="form-group form-group_with-label ">
            <label class="form-group-inner linkUrlContainer">
              <span class="label">Link URL</span>
              <span class="linkUrl">
                {{ tipLink }}
              </span>
            </label>
          </div>
          <div class="form-group-btn">
            <button
              @click="copy"
              type="button"
              class="btn lg btn_fix-width-sm"
              :disabled="!tipAmount"
            >
              Copy
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
      saving: false,
      tipAmount: ""
    };
  },
  computed: {
    productList() {
      if (this.$store.state.premiumLinks.fetchResult) {
        return this.$store.state.premiumLinks.fetchResult.list;
      }

      return [];
    },
    snapchatData() {
      return (
        this.productList.find(item => item.contentType === "snapchat") || {}
      );
    },
    loading() {
      return this.$store.state.premiumLinks.fetchLoading;
    },
    canSave() {
      if (!this.isFormValid) {
        return false;
      }
      return true;
    },
    user() {
      return this.$store.state.auth.user;
    },
    tipLink() {
      return `${window.location.origin}/${this.user.username}/one-click/tip/${
        this.tipAmount
      }`;
    }
  },
  methods: {
    deleteSnapchat() {
      this.$store
        .dispatch(`premiumLinks/delete`, { id: this.snapchatData.id })
        .then((/* r */) => {
          this.$store.dispatch(
            "global/flashToast",
            {
              text: "Changes saved successfully"
            },
            {
              root: true
            }
          );
          this.getInitData();
        });
    },
    save() {
      this.saving = true;
      const data = {
        ...this.snapchatData,
        contentType: "snapchat",
        content: this.snapchatAccount,
        price: this.snapchatPrice
      };

      const method = data.id ? "update" : "save";

      this.$store
        .dispatch(`premiumLinks/${method}`, { id: this.snapchatData.id, data })
        .then((/* r */) => {
          this.saving = false;
          this.$store.dispatch(
            "global/flashToast",
            {
              text: "Changes saved successfully"
            },
            {
              root: true
            }
          );
          this.getInitData();
        });
    },
    getInitData() {
      this.$store.commit("premiumLinks/reset");
      this.$store
        .dispatch("premiumLinks/fetch", { contentType: "snapchat" })
        .then(() => {
          this.snapchatAccount = this.snapchatData.content;
          this.snapchatPrice = this.snapchatData.price;
        });
    },
    copy() {
      this.$copyText(this.tipLink).then(() => {
        this.$store.dispatch("global/flashToast", {
          text: "Link copied!"
        });
      });
    }
  },

  mounted() {
    this.getInitData();
  }
};
</script>
