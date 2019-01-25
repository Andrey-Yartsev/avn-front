<template>
  <Modal :onClose="close">
    <div class="popup-container popup-login" slot="content">
      <div class="content">
        <div class="auth-block">
          <form v-on:submit.stop.prevent="signUp">
            <input
              v-model="name"
              type="text" name="name" placeholder="Name" autocomplete="name" class="rounded"
              v-validate="'required'"
            >
            <input
              v-model="email"
              type="email" name="email" placeholder="Email" autocomplete="email"
              v-validate="'required|email'"
              class="rounded">
            <input
              v-model="password"
              type="password" name="password" placeholder="Password"
              v-validate="'required'"
              autocomplete="new-password" class="rounded">
            <recaptcha
              v-if="showCaptcha"
              class="g-recaptcha"
              ref="recaptcha"
              @verify="onCaptchaVerified"
              @expired="onCaptchaExpired"
              :sitekey="recaptchaSiteKey"
            />
            <div class="error" v-if="err">{{ err }}</div>
            <button type="submit" class="btn block alt">Sign up</button>
          </form>

          <div class="login-or">
            <span>or</span>
          </div>

          <button class="btn block twitter">Sign in with Twitter</button>

          <div class="signUp">
            <h3>Already have an account?</h3>
            <p>
              <a href="/login" class="register" @click.prevent="openLogin">Login to OnMyTeam.com</a>
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
import Signup from "@/components/auth/signup";

export default {
  name: "SignupModal",

  mixins: [Common, Signup],

  components: {
    Modal,
    Recaptcha
  },

  methods: {
    signUp() {
      this.$validator.validate().then(result => {
        if (result) {
          this.$store.dispatch("signUp/signUpFromModal", {
            name: this.name,
            email: this.email,
            password: this.password,
            captcha: this.captcha
          });
        }
      });
    },
    close() {
      this.$store.dispatch("modal/hide", { name: "signup" });
    },
    openLogin() {
      this.close();
      this.$store.dispatch("modal/show", { name: "login" });
    }
  }
};
</script>
