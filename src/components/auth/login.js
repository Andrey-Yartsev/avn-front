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
    mainClass() {
      return this.otpAuth ? "OtpView" : "login";
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
      this.$store.dispatch("auth/login", {
        email: this.email,
        password: this.password,
        captcha: this.captcha
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
      "User banned.",
      "This Twitter is already used by another account.",
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
