<template>
  <Layout>
    <template slot="content">
      <form v-on:submit.stop.prevent="signUp">
        <input
          v-model="name"
          v-validate="'required'"
          class="rounded lg" type="text" name="name" placeholder="Name"
          autocomplete="name"
        />
        <input
          v-model="email"
          v-validate="'required|email'"
          class="rounded lg" type="email" name="email" placeholder="Email" autocomplete="email"
        />
        <input
          v-model="password"
          v-validate="'required'"
          class="rounded lg" type="password" name="password" minlength="6" placeholder="Password"
          autocomplete="new-password"/>
        <recaptcha
          v-if="showCaptcha"
          class="g-recaptcha"
          ref="recaptcha"
          @verify="onCaptchaVerified"
          @expired="onCaptchaExpired"
          :sitekey="recaptchaSiteKey"
        />
        <div class="error" v-if="err">{{ err }}</div>
        <button type="submit" class="btn lg block alt">Sign up</button>
      </form>
      <div class="login-or"><span>or</span></div>
      <button class="btn lg block twitter" @click.prevent="twitter">Sign in with Twitter</button>
      <div class="signUp">
        <h3>Already have an account?</h3>
        <p class="register"><router-link to="/login" class="register">Login to OnMyTeam.com</router-link></p>
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
