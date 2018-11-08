<template>
  <Layout :mainClass="mainClass">
    <template slot="content">
      <template v-if="otpAuth">
        <h2>Hi</h2>
        <form v-on:submit.stop.prevent="sendOtp">
          <input
            class="lg rounded otpCode" type="text" placeholder="Code"
            v-model="otpCode">
          <div class="hidden error">Email or password incorrect</div>
          <button type="submit" class="btn lg alt block" :disabled="!otpCode">Send</button>
          <div class="signUp">
            <router-link to="/logout">Switch user</router-link>
          </div>
        </form>
      </template>

      <template v-else>
        <form v-on:submit.stop.prevent="login">
          <input
            class="lg rounded"
            type="email" name="email" placeholder="Email" autocomplete="email"
            v-model="email"
          />
          <input
            class="lg rounded" type="password" name="password" placeholder="Password"
            autocomplete="current-password"
            v-model="password"
          />
          <recaptcha
            v-if="showCaptcha"
            class="g-recaptcha"
            ref="recaptcha"
            @verify="onCaptchaVerified"
            @expired="onCaptchaExpired"
            :sitekey="recaptchaSiteKey"
          />
          <div class="error" v-if="error">{{ error }}</div>
          <button type="submit" class="btn lg alt block">Login</button>
        </form>

        <div class="login-or"><span>or</span></div>
        <button class="btn lg block twitter" @click.prevent="twitter">Sign in with Twitter</button>
        <div class="signUp">
          <h3>Don't have an account yet?</h3>
          <p><router-link to="/register" class="register">Sign up for OnMyTeam.com</router-link></p>
          <p class="forgot"><router-link to="/forgot" class="forgot">Forgot your password?</router-link></p>
        </div>
      </template>
    </template>
  </Layout>
</template>

<script>
import Recaptcha from "vue-recaptcha";
import Layout from "./Layout";
import Common from "./common.js";

export default {
  name: "Login",

  mixins: [Common],

  components: {
    Recaptcha,
    Layout
  },

  data() {
    return {
      email: "",
      password: "",
      otpCode: ""
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
      if (text) {
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
    }
  }
};
</script>
