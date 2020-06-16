<template>
  <div v-if="otpAuth">
    <div class="auth-block" :class="mainClass">
      <h3>Enter 2-Factor Authentication Code</h3>
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
          <router-link to="/logout?return_path=login" class="switch-link"
            >Switch user</router-link
          >
        </div>
      </form>
    </div>
  </div>
  <div v-else>
    <div :class="containerClass">
      <div class="auth-block__title" v-if="$route.name !== 'LoginPage'">
        Login to AVN Stars
      </div>
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
          <div class="error-info" v-if="fieldError('email')">
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
          <div class="error-info" v-if="fieldError('password')">
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
          :disabled="loginInProgress"
        >
          Login
        </button>
      </form>
      <div class="login-or">
        <span>or</span>
      </div>
      <button
        class="btn block btn-twitter"
        :class="{ lg: largeControls }"
        @click.prevent="handleTwitter"
        :disabled="loginInProgress"
      >
        <span class="icn-item icn-twitter icn-size_lg"></span>Sign in with
        Twitter
      </button>
      <div class="login-or">
        <span>or</span>
      </div>
      <GoogleLoginButton :largeControls="largeControls" />
      <div class="signUp">
        <div class="signUp__body">
          <h3>
            <router-link to="/explore">Start exploring</router-link> right now
          </h3>
          <p>
            <a
              href="/register"
              class="register"
              @click.prevent.stop="openSignup"
            >
              {{ signUpText }}
            </a>
          </p>
          <p class="forgot">
            <a href="/forgot" class="forgot" @click.prevent="forgot"
              >Forgot your password?</a
            >
          </p>
          <p class="agree">
            By signing up and logging in to AVN Stars I affirm that I am at
            least 18 years of age or older and I agree to the following
            <a href="/terms">terms.</a>
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
import BrowserStore from "store";
import GoogleLoginButton from "./GoogleLogin";

export default {
  name: "LoginForm",

  mixins: [Common, Login, Form],

  components: {
    Recaptcha,
    GoogleLoginButton
  },

  props: {
    type: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      loginInProgress: false
    };
  },

  computed: {
    signUpText() {
      return "Sign up for AVN Stars";
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
    },
    otpAuth() {
      return this.$store.state.auth.otpAuth;
    },
    mainClass() {
      return this.otpAuth ? "otp" : "login";
    },
    callback() {
      return this.$store.state.modal.login.data.callback;
    }
  },

  methods: {
    handleTwitter() {
      if (this.$store.state.awards.savedData) {
        BrowserStore.set("nomUserRegData", this.$store.state.awards.savedData);
      }
      this.twitter();
    },
    login() {
      this.loginInProgress = true;
      setTimeout(() => {
        this.$validator.validate().then(result => {
          if (result) {
            this.$store
              .dispatch("auth/" + this.loginAction, {
                email: this.email,
                password: this.password,
                captcha: this.captcha
              })
              .then(() => {
                this.callback && this.callback();
                setTimeout(() => {
                  this.loginInProgress = false;
                }, 1000);
              });
          }
        });
      }, 100);
    },
    openSignup() {
      switch (this.type) {
        case "page":
          this.$router.push("/register");
          break;
        case "modal":
          this.$store.dispatch("modal/show", {
            name: "signup",
            data: {
              callback: this.callback
            }
          });
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
