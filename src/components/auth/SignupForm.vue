<template>
  <div :class="containerClass">
    <form v-on:submit.stop.prevent="signUp">
      <div
        class="form-group form-group_clear-gaps"
        :class="{ 'field-invalid': fieldError('name') }"
      >
        <input
          v-model="name"
          v-validate="'required'"
          class="rounded"
          :class="{ lg: largeControls }"
          type="text"
          name="name"
          placeholder="Name"
          autocomplete="name"
          data-vv-validate-on="blur"
        />
        <div class="tooltip-info" v-if="fieldError('name')">
          {{ fieldError("name") }}
        </div>
      </div>
      <div
        class="form-group form-group_clear-gaps"
        :class="{ 'field-invalid': fieldError('email') }"
      >
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
        <div class="tooltip-info" v-if="fieldError('email')">
          {{ fieldError("email") }}
        </div>
      </div>
      <div
        class="form-group form-group_clear-gaps"
        :class="{ 'field-invalid': fieldError('password') }"
      >
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
        <div class="tooltip-info" v-if="fieldError('password')">
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
      >
        Sign up
      </button>
    </form>
    <div class="login-or"><span>or</span></div>
    <button
      class="btn block twitter"
      @click.prevent="twitter"
      :class="{ lg: largeControls }"
    >
      Sign in with Twitter
    </button>
    <div class="signUp">
      <h3>Already have an account?</h3>
      <p class="register">
        <a href="/login" class="register" @click.prevent="openLogin"
          >Login to OnMyTeam.com</a
        >
      </p>
    </div>
  </div>
</template>

<script>
import Recaptcha from "vue-recaptcha";
import Common from "@/components/auth/common";
import Signup from "@/components/auth/signup";
import Form from "@/mixins/form";

export default {
  name: "SignUp",

  mixins: [Common, Signup, Form],

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
    }
  },

  methods: {
    openLogin() {
      switch (this.type) {
        case "page":
          this.$router.push("/login");
          break;
        case "modal":
          this.$store.dispatch("modal/show", { name: "login" });
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
          this.$store.dispatch("signUp/" + this.signupAction, {
            name: this.name,
            email: this.email,
            password: this.password,
            captcha: this.captcha
          });
        }
      });
    }
  }
};
</script>
