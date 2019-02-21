<template>
  <div v-if="otpAuth">
    <div class="auth-block auth-block_sm-size">
      <h2>Hi</h2>
      <form v-on:submit.stop.prevent="sendOtp">
        <input
          class="rounded otpCode"
          :class="{ lg: largeControls }"
          type="text"
          placeholder="Code"
          v-model="otpCode"
        />
        <div class="hidden error">Email or password incorrect</div>
        <button
          type="submit"
          class="btn lalt block"
          :disabled="!otpCode"
          :class="{ lg: largeControls }"
        >
          Send
        </button>
        <div class="signUp">
          <router-link to="/logout" class="switch-link"
            >Switch user</router-link
          >
        </div>
      </form>
    </div>
  </div>
  <div v-else>
    <div :class="containerClass">
      <form
        v-on:submit.stop.prevent="login"
        :class="{ 'login-form': type === 'page' }"
      >
        <div
          class="form-group form-group_clear-gaps"
          :class="{ 'field-invalid': fieldError('email') }"
        >
          <div class="form-field">
            <input
              type="email"
              name="email"
              placeholder="Email"
              autocomplete="email"
              class="rounded"
              :class="{ lg: largeControls }"
              v-model="email"
              v-validate="'required|email'"
              data-vv-validate-on="blur"
            />
          </div>
          <div class="tooltip-info" v-if="fieldError('email')">
            {{ fieldError("email") }}
          </div>
        </div>
        <div
          class="form-group form-group_clear-gaps"
          :class="{ 'field-invalid': fieldError('password') }"
        >
          <div class="form-field">
            <input
              type="password"
              name="password"
              placeholder="Password"
              autocomplete="current-password"
              class="rounded"
              :class="{ lg: largeControls }"
              v-model="password"
              v-validate="'required'"
              data-vv-validate-on="blur"
            />
          </div>
          <div class="tooltip-info" v-if="fieldError('password')">
            {{ fieldError("password") }}
          </div>
        </div>
        <recaptcha
          v-if="showCaptcha"
          class="g-recaptcha"
          ref="recaptcha"
          @verify="captchaVerified"
          @expired="onCaptchaExpired"
          :sitekey="recaptchaSiteKey"
        />
        <div class="error" v-if="err">{{ err }}</div>
        <button
          type="submit"
          class="btn alt block"
          :class="{ lg: largeControls }"
        >
          Login
        </button>
      </form>
      <template v-if="$root.isTeamApp">
        <div class="login-or">
          <span>or</span>
        </div>
        <button
          class="btn block twitter"
          :class="{ lg: largeControls }"
          @click.prevent="twitter"
        >
          Sign in with Twitter
        </button>
      </template>
      <div class="signUp">
        <div class="signUp__body">
          <h3>Don't have an account yet?</h3>
          <p>
            <a href="/register" class="register" @click.prevent="openSignup">
              {{ signUpText }}
            </a>
          </p>
          <p class="forgot">
            <a href="/forgot" class="forgot" @click.prevent="forgot"
              >Forgot your password?</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Recaptcha from "vue-recaptcha";
import Common from "@/components/auth/common";
import Login from "@/components/auth/login";
import Form from "@/mixins/form";

export default {
  name: "LoginForm",

  mixins: [Common, Login, Form],

  components: {
    Recaptcha
  },

  props: {
    type: {
      type: String,
      required: true
    }
  },

  computed: {
    signUpText() {
      if (this.$root.isTeamApp) {
        return "Sign up for OnMyTeam.com";
      }

      return "Sign up";
    },
    loginAction() {
      switch (this.type) {
        case "page":
          return "login";
        case "modal":
        case "dropdown":
          return "loginFromModal";
      }
    },
    largeControls() {
      switch (this.type) {
        case "page":
          return true;
        case "modal":
        case "dropdown":
          return false;
      }
    },
    containerClass() {
      if (this.type === "page") {
        return null;
      }
      return { "auth-block auth-block_sm-size": true };
    }
  },

  methods: {
    login() {
      this.$validator.validate().then(result => {
        if (result) {
          this.$store.dispatch("auth/" + this.loginAction, {
            email: this.email,
            password: this.password,
            captcha: this.captcha
          });
        }
      });
    },
    openSignup() {
      switch (this.type) {
        case "page":
          this.$router.push("/register");
          break;
        case "modal":
          this.$store.dispatch("modal/show", { name: "signup" });
          this.$emit("openSignup");
          break;
        case "dropdown":
          this.$store.commit("common/headerSignup", true);
          break;
      }
    },
    forgot() {
      this.$router.push("/forgot");
      this.$emit("goToForgot");
    }
  }
};
</script>
