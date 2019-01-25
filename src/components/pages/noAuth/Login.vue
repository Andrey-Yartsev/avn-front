<template>
  <Layout :mainClass="mainClass">
    <template slot="content">
      <LoginForm type="page" />
    </template>
  </Layout>
</template>

<script>
import Layout from "./Layout";
import LoginForm from "@/components/auth/LoginForm";

export default {
  name: "Login",

  components: {
    Layout,
    LoginForm
  },

  computed: {
    otpAuth() {
      return this.$store.state.auth.otpAuth;
    },
    mainClass() {
      return this.otpAuth ? "OtpView" : "login";
    }
  }
};
</script>
