<template>
  <div>
    <h1 class="form-title settings-title" v-if="$mq === 'desktop'">
      Free Trials
    </h1>
    <div class="trialsSectionCollection">
      <div class="form-title border-top">
        <div class="inner">
          <span class="semi-transparent">
            Unique Link
            <p class="subtext">
              The link will be unique and will be available for only one person
            </p>
          </span>
          <label class="toggle-element">
            <input type="checkbox" name="isUnique" v-model="isUnique" />
            <span class="toggle-element_switcher" />
          </label>
        </div>
      </div>

      <div class="container" v-if="!isUnique">
        <div class="form-group form-group_with-label">
          <label class="form-group-inner">
            <span class="label">Person amount</span>
            <div class="row">
              <div class="col-1-2">
                <input
                  name="amount"
                  class="default-disabled"
                  v-model="limit"
                  type="number"
                  step="1"
                />
              </div>
            </div>
          </label>
        </div>
      </div>

      <div class="container">
        <div class="form-group form-group_with-label">
          <label class="form-group-inner">
            <span class="label">Free trail months amount</span>
            <div class="row">
              <div class="col-1-2">
                <div class="select-wrapper">
                  <select
                    name="months"
                    class="default-disabled"
                    v-model="months"
                  >
                    <option v-for="item in 12" :value="item" :key="item">
                      {{ item }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div class="shadow-block referrals-link">
        <div class="referral-desc">
          <p class="subtext">
            Copy this link to send to
            {{ this.getPersonsAmountText }}
            you want to provide a trial subscription for {{ months }}
            {{ months > 1 ? "months" : "month" }}.
            <b v-if="isUnique">One unique link for each person!</b>
          </p>
          <button
            type="button"
            class="btn btn_fix-width-sm border alt"
            @click="generateCode"
          >
            Generate<span class="hidden-mobile" v-if="$mq === 'desktop'">
            </span>
          </button>
          <button
            v-if="showCopyButton"
            type="button"
            class="btn btn_fix-width-sm border alt btn-copy-url btn-copy-url btn-copy-url_reset-mt"
            @click="copyCode"
          >
            Copy
          </button>
        </div>
        <div class="referrals-url" v-if="link">
          <span class="referrals-url__link">{{ link }}</span>
        </div>
      </div>

      <UsersTable />
    </div>
  </div>
</template>

<script>
import Common from "../common";
import UsersTable from "./UsersTable";

export default {
  name: "StorySettingsContent",
  mixins: [Common],
  components: {
    UsersTable
  },
  data() {
    return {
      showCopyButton: false,
      isUnique: true,
      months: 1,
      limit: 1
    };
  },
  computed: {
    link() {
      if (!this.$store.state.trial.code) {
        return null;
      }
      return (
        window.location.origin + "/?trialCode=" + this.$store.state.trial.code
      );
    },
    getPersons() {
      return Number.parseInt(this.limit);
    },
    getPersonsAmountText() {
      return this.isUnique || this.limit <= 1
        ? "the person"
        : `${this.limit} persons`;
    }
  },
  methods: {
    generateCode() {
      this.$store
        .dispatch("trial/getCode", this.getData(), { root: true })
        .then(() => {
          this.$copyText(this.link)
            .then(() => {
              this.$store.dispatch("global/flashToast", {
                text: "Trial URL copied!"
              });
            })
            .catch(() => {
              this.showCopyButton = true;
            });
        });
    },
    copyCode() {
      this.$copyText(this.link)
        .then(() => {
          this.$store.dispatch("global/flashToast", {
            text: "Trial URL copied!"
          });
        })
        .catch(() => {
          this.$store.dispatch("global/flashToast", {
            text: "There was a problem. Copy manual please",
            error: true
          });
        });
    },
    getData() {
      const data = {
        months: this.months,
        limit: Number.parseInt(this.limit)
      };
      if (this.isUnique) {
        data.limit = 1;
      }
      return data;
    }
  }
};
</script>
