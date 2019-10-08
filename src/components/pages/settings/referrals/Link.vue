<template>
  <div>
    <h1 class="form-title settings-title" v-if="$mq === 'desktop'">
      Referral URL
      <!-- QR temporary hidden -->
      <!--<button type="button">Show QR</button>-->
    </h1>
    <div class="form-title hidden-desktop" v-if="$mq === 'mobile'">
      <div class="inner">
        <span class="semi-transparent">
          Referral URL
        </span>
        <!-- QR temporary hidden -->
        <!-- <button type="button">Show QR</button> -->
      </div>
    </div>
    <div class="border-top shadow-block referrals-link">
      <div class="referrals-url">
        <a :href="url" class="referrals-url__link">{{ url }}</a>
      </div>
      <div class="referral-desc">
        <p class="subtext">
          Refer creators to stars.avn.com receive 5% of their earnings as a
          bonus!
        </p>
        <button
          type="button"
          class="btn btn_fix-width-sm border alt btn-copy-url"
          @click="copyToClipboard"
        >
          Copy<span class="hidden-mobile" v-if="$mq === 'desktop'"> link</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import User from "@/mixins/user";

export default {
  name: "SettingsReferralsLink",
  mixins: [User],
  computed: {
    url() {
      return (
        window.location.origin +
        "/" +
        this.user.username +
        "/?code=" +
        this.user.referralUrl
      );
    }
  },

  methods: {
    copyToClipboard() {
      this.$copyText(this.url).then(() => {
        this.$store.dispatch("global/flashToast", {
          text: "Referral URL copied!"
        });
      });
    }
  }
};
</script>
