<template>
  <Layout >
    <template slot="content">
      <form v-on:submit.stop.prevent="signUp">
        <input
          v-model="name"
          class="rounded lg" type="text" name="name" placeholder="Name" required autocomplete="name"/>
        <input
          v-model="email"
          class="rounded lg" type="email" name="email" placeholder="Email" required autocomplete="email"/>
        <input
          v-model="password"
          class="rounded lg" type="password" name="password" minlength="6" placeholder="Password" required
          autocomplete="new-password"/>
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
      <button class="btn lg block twitter" @click.prevent="twitter">Sign in with Twitter</button>
      <div class="signUp">
        <h3>Already have an account?</h3>
        <p><router-link to="/login" class="register">Login to OnMyTeam.com</router-link></p>
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
