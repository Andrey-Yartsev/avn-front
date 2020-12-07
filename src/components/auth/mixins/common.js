import Twitter from "@/utils/twitter";
import BrowserStore from "store";

export default {
  data() {
    return {
      captcha: ""
    };
  },

  computed: {
    recaptchaSiteKey() {
      return process.env.VUE_APP_RECAPTCHA_SITE_KEY;
    }
  },

  methods: {
    twitter() {
      const storedOkevData = BrowserStore.get("okevData");
      if (window.okev && !storedOkevData) {
        BrowserStore.set("okevData", JSON.stringify(window.okev.all()));
      }
      window.location.href = Twitter.getLoginUrl();
    },
    onCaptchaVerified(recaptchaToken) {
      this.captcha = recaptchaToken;
    },
    onCaptchaExpired: function() {
      this.$refs.recaptcha.reset();
    }
  }
};
