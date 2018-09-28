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
          class="rounded lg" type="password" name="password" placeholder="Password" required
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
import Common from "./common";

export default {
  name: "SignUp",

  mixins: [Common],

  components: {
    Layout,
    Recaptcha
  },

  data() {
    return {
      name: "",
      email: "",
      password: ""
    };
  },

  computed: {
    error() {
      return this.$store.state.signUp.signUpError;
    },
    showCaptcha() {
      return this.$store.state.signUp.showCaptcha;
    }
  },

  methods: {
    signUp() {
      this.$store.dispatch("signUp/signUp", {
        name: this.name,
        email: this.email,
        password: this.password,
        captcha: this.captcha
      });
    }
  },

  created() {
    this.$store.dispatch("signUp/init");
  }
};
</script>
