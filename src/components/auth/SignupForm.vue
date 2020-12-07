<template>
  <div :class="containerClass">
    <div class="auth-block__title" v-if="$route.name !== 'RegisterPage'">
      Sign up for AVN Stars
    </div>
    <form v-on:submit.stop.prevent="signUp">
      <div
        class="form-group form-group_clear-gaps"
        :class="{ 'field-invalid': fieldError('name') }"
      >
        <div class="form-field">
          <input
            v-model="name"
            v-validate="'required'"
            class="rounded"
            :class="{ lg: largeControls }"
            type="text"
            name="name"
            placeholder="Display Name (public)"
            autocomplete="name"
            data-vv-validate-on="blur"
          />
        </div>
        <div class="error-info" v-if="fieldError('name')">
          {{ fieldError("name") }}
        </div>
      </div>
      <div
        class="form-group form-group_clear-gaps"
        :class="{ 'field-invalid': fieldError('name') }"
      >
        <div class="form-field">
          <input
            v-model="username"
            v-validate="'required'"
            class="rounded"
            :class="{ lg: largeControls }"
            type="text"
            name="username"
            placeholder="Username"
            autocomplete="username"
            data-vv-validate-on="blur"
          />
        </div>
        <div class="error-info" v-if="fieldError('username')">
          {{ fieldError("username") }}
        </div>
      </div>
      <div
        class="form-group form-group_clear-gaps"
        :class="{ 'field-invalid': fieldError('email') }"
      >
        <div class="form-field">
          <input
            v-model="email"
            v-validate="'required|email'"
            class="rounded"
            :class="{ lg: largeControls }"
            type="email"
            name="email"
            placeholder="Email"
            autocomplete="email"
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
            v-model="password"
            v-validate="'required'"
            class="rounded"
            :class="{ lg: largeControls }"
            type="password"
            name="password"
            minlength="6"
            placeholder="Password"
            autocomplete="new-password"
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
        @verify="onCaptchaVerified"
        @expired="onCaptchaExpired"
        :sitekey="recaptchaSiteKey"
      />
      <div class="error" v-if="error">{{ error }}</div>
      <button
        type="submit"
        class="btn block alt"
        :class="{ lg: largeControls }"
        :disabled="isSaving"
      >
        Sign up
      </button>
    </form>
    <div class="login-or"><span>or</span></div>
    <button
      class="btn block btn-twitter btn-twitter-auth"
      @click.prevent="twitter"
      :class="{ lg: largeControls }"
      :disabled="isSaving"
    >
      <span class="icn-item icn-twitter icn-size_lg"></span>Sign in with Twitter
    </button>
    <div class="login-or"><span>or</span></div>
    <GoogleLoginButton
      :largeControls="largeControls"
      :isSaving="isSaving"
      @loginStart="
        () => {
          isSaving = true;
        }
      "
      @loginEnd="
        () => {
          isSaving = false;
        }
      "
    />
    <div class="signUp">
      <h3>Already have an account?</h3>
      <p class="register">
        <a href="/login" class="register" @click.prevent.stop="openLogin">{{
          loginText
        }}</a>
      </p>
      <p class="agree">
        By signing up to AVN Stars I affirm that I am at least 18 years of age
        or older and I agree to the following <a href="/terms">terms.</a>
      </p>
    </div>
  </div>
</template>

<script>
import Recaptcha from "vue-recaptcha";
import Common from "@/components/auth/mixins/common";
import Signup from "@/components/auth/mixins/signup";
import Form from "@/mixins/form";
import GoogleLoginButton from "./GoogleLogin";

export default {
  name: "SignUp",

  mixins: [Common, Signup, Form],

  data() {
    return {
      isSaving: false
    };
  },

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

  computed: {
    loginText() {
      return "Login to AVN Stars";
    },
    signupAction() {
      switch (this.type) {
        case "page":
          return "signUp";
        case "modal":
        case "dropdown":
          return "signUpFromModal";
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
    callback() {
      return this.$store.state.modal.signup.data.callback;
    }
  },

  methods: {
    openLogin() {
      switch (this.type) {
        case "page":
          this.$router.push("/login");
          break;
        case "modal":
          this.$store.dispatch("modal/show", {
            name: "login",
            data: {
              callback: this.callback
            }
          });
          this.$emit("openLogin");
          break;
        case "dropdown":
          this.$store.commit("common/headerSignup", false);
          break;
      }
    },
    signUp() {
      this.$validator.validate().then(result => {
        if (result) {
          if (this.isSaving) return;
          this.isSaving = true;
          this.$store
            .dispatch("signUp/" + this.signupAction, {
              name: this.name,
              username: this.username,
              email: this.email,
              password: this.password,
              captcha: this.captcha
            })
            .then(() => {
              this.callback && this.callback();
              this.isSaving = false;
            })
            .catch(() => {
              this.isSaving = false;
            });
        } else {
          this.isSaving = false;
        }
      });
    }
  }
};
</script>
