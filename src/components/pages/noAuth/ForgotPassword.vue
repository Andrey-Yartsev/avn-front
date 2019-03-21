<template>
  <div class="forgot staticPage">
    <div class="container">
      <h1>Reset Password</h1>
      <h2>
        Please fill out your email. A link to reset password will be sent there.
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
                :disabled="loading || sendSuccess"
              />
            </span>
            <div class="error-info" v-if="error">
              {{ error }}
            </div>
            <div class="success-info info" v-else-if="sendSuccess">
              Please check your mailbox for further instructions to recover your
              password.
            </div>
          </span>
        </div>
        <div class="g-recaptcha" id="captcha"></div>
        <div class="form-group form-group_row">
          <button type="submit" class="btn lg alt" v-if="!sendSuccess">
            Reset password
          </button>
        </div>
      </form>
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
