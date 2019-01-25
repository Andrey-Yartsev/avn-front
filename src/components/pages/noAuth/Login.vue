<template>
  <Layout :mainClass="mainClass">
    <template slot="content">
      <template v-if="otpAuth">
        <h2>Hi</h2>
        <form v-on:submit.stop.prevent="sendOtp">
          <input
            class="lg rounded otpCode" type="text" placeholder="Code"
            v-model="otpCode">
          <div class="hidden error">Email or password incorrect</div>
          <button type="submit" class="btn lg alt block" :disabled="!otpCode">Send</button>
          <div class="signUp">
            <router-link to="/logout">Switch user</router-link>
          </div>
        </form>
      </template>

      <template v-else>
        <form v-on:submit.stop.prevent="login" class="login-form">
          <div class="form-group form-group_clear-gaps">
            <input
              class="lg rounded"
              type="email" name="email" placeholder="Email" autocomplete="email"
              v-model="email"
              v-validate="'required|email'"
            />
          </div>
          <div class="form-group form-group_clear-gaps">
            <input
              class="lg rounded" type="password" name="password" placeholder="Password"
              autocomplete="current-password"
              v-model="password"
              v-validate="'required'"
            />
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
          <button type="submit" class="btn lg alt block">Login</button>
        </form>

        <div class="login-or"><span>or</span></div>
        <button class="btn lg block twitter" @click.prevent="twitter">Sign in with Twitter</button>
        <div class="signUp">
          <div class="signUp__body">
            <h3>Don't have an account yet?</h3>
            <p>
              <router-link to="/register" class="register">Sign up for OnMyTeam.com</router-link>
            </p>
          </div>
          <p class="forgot">
            <router-link to="/forgot" class="forgot">Forgot your password?</router-link>
          </p>
        </div>
      </template>
    </template>
  </Layout>
</template>

<script>
import Recaptcha from "vue-recaptcha";
import Layout from "./Layout";
import Common from "@/components/auth/common";
import Login from "@/components/auth/login";

export default {
  name: "Login",

  mixins: [Common, Login],

  components: {
    Recaptcha,
    Layout
  }
};
</script>
