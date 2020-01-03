<template>
  <div>
    <h1 class="form-title settings-title" v-if="$mq === 'desktop'">
      Free Trials
    </h1>
    <div class="trialsSectionCollection">
      <div class="border-top shadow-block referrals-link">
        <div class="referrals-url" v-if="link">
          <span class="referrals-url__link">{{ link }}</span>
        </div>
        <div class="referral-desc">
          <p class="subtext">
            Copy this link to send to the person you want to provide a trial
            subscription for 30 days.
            <b>One unique link for each person!</b>
          </p>
          <button
            type="button"
            class="btn btn_fix-width-sm border alt btn-copy-url btn-copy-url_reset-mt"
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
      showCopyButton: false
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
    }
  },
  methods: {
    generateCode() {
      this.$store.dispatch("trial/getCode").then(() => {
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
    }
  }
};
</script>
