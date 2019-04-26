<template>
  <div>
    <h1 class="form-title" v-if="$mq === 'desktop'">
      Free Trials
    </h1>
    <div class="trialsSectionCollection">
      <div class="border-top shadow-block referrals-link" v-if="link">
        <a :href="link">{{ link }}</a>
        <div class="referral-desc">
          <p class="subtext">
            Copy this link to send to the person you want to provide a trial
            subscription for 30 days.
            <b>One unique link for each person!</b>
          </p>
          <button
            type="button"
            class="btn border alt btn-copy-url"
            @click="copyToClipboard"
          >
            Copy<span class="hidden-mobile"> link</span>
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
    getLink() {
      this.$store.dispatch("trial/getCode");
    },
    copyToClipboard() {
      this.$copyText(this.link).then(() => {
        this.$store.dispatch("global/flashToast", "Trial URL copied!");
        this.getLink();
      });
    }
  },
  mounted() {
    this.getLink();
  }
};
</script>
