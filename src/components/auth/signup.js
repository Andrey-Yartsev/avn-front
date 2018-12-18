export default {
  data() {
    return {
      name: "",
      email: "",
      password: ""
    };
  },

  computed: {
    error() {
      return this.$store.state.signUp.signUpError;
    },
    showCaptcha() {
      return this.$store.state.signUp.showCaptcha;
    }
  },

  watch: {
    error(text) {
      if (text && this.showCaptcha) {
        this.$refs.recaptcha.reset();
      }
    }
  },

  methods: {
    signUp() {
      this.$store.dispatch("signUp/signUp", {
        name: this.name,
        email: this.email,
        password: this.password,
        captcha: this.captcha
      });
    }
  },

  created() {
    this.$store.dispatch("signUp/init");
  }
};
