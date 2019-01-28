<template>
  <Layout>
    <template slot="content">
      <form v-on:submit.stop.prevent="signUp">
        <div
          class="form-group form-group_clear-gaps"
          :class="{ 'field-invalid': fieldError('name') }"
        >
          <input
            v-model="name"
            v-validate="'required'"
            class="rounded lg"
            type="text"
            name="name"
            placeholder="Name"
            autocomplete="name"
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
            class="rounded lg"
            type="email"
            name="email"
            placeholder="Email"
            autocomplete="email"
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
            class="rounded lg"
            type="password"
            name="password"
            minlength="6"
            placeholder="Password"
            autocomplete="new-password"
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
        <button type="submit" class="btn lg block alt">Sign up</button>
      </form>
      <div class="login-or"><span>or</span></div>
      <button class="btn lg block twitter" @click.prevent="twitter">
        Sign in with Twitter
      </button>
      <div class="signUp">
        <h3>Already have an account?</h3>
        <p class="register">
          <router-link to="/login" class="register"
            >Login to OnMyTeam.com</router-link
          >
        </p>
      </div>
    </template>
  </Layout>
</template>

<script>
import Recaptcha from "vue-recaptcha";
import Layout from "./Layout";
import Common from "@/components/auth/common";
import Signup from "@/components/auth/signup";

export default {
  name: "SignUp",

  mixins: [Common, Signup],

  components: {
    Layout,
    Recaptcha
  }
};
</script>
