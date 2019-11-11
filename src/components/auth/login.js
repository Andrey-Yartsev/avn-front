export default {
  data() {
    return {
      email: "",
      password: "",
      otpCode: "",
      error2: null
    };
  },

  computed: {
    error() {
      return this.$store.state.auth.error;
    },
    showCaptcha() {
      return this.$store.state.auth.showCaptcha;
    },
    otpAuth() {
      return this.$store.state.auth.otpAuth;
    },
    err() {
      if (this.error) {
        return this.error;
      }
      if (this.error2) {
        return this.error2;
      }
      return null;
    }
  },

  watch: {
    error(text) {
      if (text && this.$refs.recaptcha) {
        this.$refs.recaptcha.reset();
      }
    }
  },

  methods: {
    login() {
      this.$validator.validate().then(result => {
        if (result) {
          this.$store.dispatch("auth/login", {
            email: this.email,
            password: this.password,
            captcha: this.captcha
          });
        }
      });
    },
    sendOtp() {
      this.$store.dispatch("otp/login", this.otpCode).then(() => {
        this.$router.push("/");
      });
    },
    captchaVerified(recaptchaToken) {
      this.onCaptchaVerified(recaptchaToken);
      this.login();
    }
  },

  mounted() {
    const errors = [
      "Twitter connection error",
      "User banned.",
      "This Twitter is already used by another account.",
      "This Twitter is already used by another user account.",
      "This account already used Twitter.",
      "Email in twitter account is required."
    ];
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error) {
      if (errors.indexOf(error) !== -1) {
        this.error2 = error;
      }
    }
  }
};
