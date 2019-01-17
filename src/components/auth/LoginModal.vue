<template>
  <Modal :onClose="close">
    <div class="popup-container popup-login" slot="content">
      <div class="content">
        <div class="auth-block auth-block_sm-size">
          <form v-on:submit.stop.prevent="login">
            <input
              class="rounded"
              type="email" name="email" placeholder="Email" autocomplete="email"
              v-model="email"
            >
            <input
              type="password" name="password" placeholder="Password" autocomplete="current-password"
              class="rounded"
              v-model="password"
            >
            <recaptcha
              v-if="showCaptcha"
              class="g-recaptcha"
              ref="recaptcha"
              @verify="captchaVerified"
              @expired="onCaptchaExpired"
              :sitekey="recaptchaSiteKey"
            />
            <div class="error" v-if="error">{{ error }}</div>
            <div class="error" v-if="error2">{{ error2 }}</div>
            <button type="submit" class="btn alt block">Login</button>
          </form>
          <div class="login-or">
            <span>or</span>
          </div>
          <button class="btn block twitter">Sign in with Twitter</button>
          <div class="signUp">
            <h3>Don't have an account yet?</h3>
            <p>
              <a href="/register" class="register" @click.prevent="openSignup">Sign up for OnMyTeam.com</a>
            </p>
            <p class="forgot">
              <router-link to="/forgot" class="forgot">Forgot your password?</router-link>
            </p>
          </div>
        </div>
      </div>
      <button type="button" class="close" @click="close"></button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Recaptcha from "vue-recaptcha";
import Common from "@/components/auth/common";
import Login from "@/components/auth/login";

export default {
  name: "LoginModal",

  mixins: [Common, Login],

  components: {
    Modal,
    Recaptcha
  },

  methods: {
    login() {
      this.$store.dispatch("auth/loginFromModal", {
        email: this.email,
        password: this.password,
        captcha: this.captcha
      });
    },
    close() {
      this.$store.commit("modal/hideSafe", { name: "login" });
    },
    openSignup() {
      this.close();
      this.$store.dispatch("modal/show", { name: "signup" });
    }
  }
};
</script>
