<template>
  <div class="forgot staticPage">
    <div class="container">
      <template v-if="!sendSuccess">
        <h1>Reset Password</h1>
        <h2>
          Please fill out your email. A link to reset password will be sent
          there.
        </h2>
        <form class="forgot-password-form" v-on:submit.stop.prevent="send">
          <div class="form-group form-group_row">
            <span class="form-group form-group_clear-gaps">
              <span class="form-field">
                <input
                  v-model="email"
                  class="lg rounded"
                  type="text"
                  name="email"
                  placeholder="Your Email"
                  :disabled="loading"
                />
              </span>
              <div class="error-info" v-if="error">
                {{ error }}
              </div>
              <div class="success-info info">
                Please check your mailbox for further instructions to recover
                your password.
              </div>
            </span>
          </div>
          <div class="g-recaptcha" id="captcha"></div>
          <div class="form-group form-group_row">
            <button type="submit" class="btn lg alt">
              Reset password
            </button>
          </div>
        </form>
      </template>
      <template v-else>
        <h1>Check your email</h1>
        <p>
          We've sent an email to {{ maskedEmail }}. Click the link in the email
          to reset your password.
        </p>
        <p>
          If you don't see the email, check other places it might be, like your
          junk, spam, social, or other folders.
        </p>
      </template>
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Footer from "@/components/footer/Index.vue";

export default {
  name: "ForgotPasswordPage",

  components: {
    Footer
  },

  data() {
    return {
      email: ""
    };
  },

  computed: {
    sendSuccess() {
      return this.$store.state.forgot.sendSuccess;
    },
    loading() {
      return this.$store.state.forgot.sendLoading;
    },
    error() {
      if (this.$store.state.forgot.sendError) {
        return this.$store.state.forgot.sendError.message;
      }
      return null;
    },
    maskedEmail() {
      // const regex = /(?<=.)[^@\n](?=[^@\n]*?@)|(?:(?<=@.)|(?!^)\\G(?=[^@\n]*$)).(?=.*\.)/gm;
      // const subst = `*`;
      return this.email; // .replace(regex, subst);
    }
  },

  methods: {
    send() {
      this.$store.dispatch("forgot/send", { email: this.email });
    }
  },

  beforeDestroy() {
    this.$store.dispatch("forgot/sendReset");
  }
};
</script>
