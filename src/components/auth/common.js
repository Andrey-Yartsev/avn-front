import Twitter from "@/utils/twitter";

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
      window.location.href = Twitter.getLoginUrl();
    },
    onCaptchaVerified(recaptchaToken) {
      this.captcha = recaptchaToken;
    },
    onCaptchaExpired: function() {
      this.$refs.recaptcha.reset();
    },
    fieldError(name) {
      return this.errors.first(name);
    }
  }
};
