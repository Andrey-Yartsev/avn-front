<template>
  <div class="border-top">
    <div
      class="toggle-wrapper option-earn-money"
      :class="{ disabled: !canSave }"
    >
      <label class="toggle-label semi-transparent" for="is_content_expiration">
        Content Expiration
      </label>
      <label class="toggle-element">
        <input
          type="checkbox"
          id="is_content_expiration"
          name="isWantEarn"
          @change="save"
          :disabled="saving || !canSave"
          v-model="expiredContent.isEnabled"
        />
        <span class="toggle-element_switcher"></span>
      </label>
    </div>
    <div class="form-group form-group_with-label">
      <div :class="{ 'container shadow-block': $mq === 'mobile' }">
        <div class="payouts-legal-form">
          <label class="form-group-inner subscription discountField">
            <span class="label">Days</span>
            <span class="subscription__field ">
              <span class="form-field">
                <input
                  type="number"
                  min="0"
                  step="1"
                  :disabled="expiredContent.isEnabled"
                  name="expiredContentDays"
                  v-model="expiredContent.days"
                />
                <sup>
                  *Period for available content
                </sup>
              </span>
            </span>
          </label>
          <label class="form-group-inner subscription">
            <span class="label">Unlock price</span>
            <span class="subscription__field field-symbol-currency">
              <span class="form-field">
                <input
                  class="field-gap_currency field-gap_timeunit"
                  type="number"
                  min="0"
                  max="500"
                  step="0.01"
                  :disabled="expiredContent.isEnabled"
                  name="expiredContentUnlockPrice"
                  v-model="expiredContent.unlockPrice"
                />
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>
    <div v-if="expiredContent.isEnabled" class="form-group-btn">
      <button
        type="button"
        class="btn btn_reset-mgap alt border btn_fix-width-lg connect-twitter hidden-mobile"
        @click="generateUnlockLink"
      >
        Generate unlock link
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpiredContent",
  data() {
    return {
      expiredContent: {
        isEnabled: false,
        days: "",
        unlockPrice: ""
      },
      saving: false
    };
  },
  computed: {
    canSave() {
      if (
        !this.expiredContent.isEnabled &&
        (!this.expiredContent.days || !this.expiredContent.unlockPrice)
      ) {
        return false;
      }
      return true;
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
    save() {
      this.saving = true;

      const data = {
        ...this.$store.state.auth.user,
        expiredContent: {
          isEnabled: this.expiredContent.isEnabled,
          days: parseInt(this.expiredContent.days),
          unlockPrice: this.expiredContent.unlockPrice
        }
      };

      this.$store.dispatch("profile/update", data).then(() => {
        this.saving = false;
      });
    },
    init() {
      if (!this.$store.state.auth.user.expiredContent) {
        return;
      }
      const {
        isEnabled,
        days,
        unlockPrice
      } = this.$store.state.auth.user.expiredContent;
      this.expiredContent.isEnabled = isEnabled;
      this.expiredContent.days = days;
      this.expiredContent.unlockPrice = unlockPrice;
    },
    generateUnlockLink() {
      this.$store
        .dispatch("profile/home/getUnlockExpiredContentLink", null, {
          root: true
        })
        .then(res => {
          const urlString = `${window.location.origin}/${
            this.$store.state.auth.user.username
          }/posts/${res.accessToken}`;
          this.$store.dispatch("modal/show", {
            name: "mediaAccessLink",
            data: {
              text:
                "Share this one-off link to give free access to all your expired content",
              linkUrl: urlString
            }
          });
        })
        .catch(err => {
          console.log(err);
          this.$store.dispatch("global/flashToast", {
            text: err.message,
            type: "error"
          });
        });
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
