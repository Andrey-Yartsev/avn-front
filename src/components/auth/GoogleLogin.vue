<template>
  <GoogleLogin
    class="btn block btn-google"
    :class="{ lg: largeControls }"
    :params="params"
    :onSuccess="onSuccess"
    :onFailure="onFailure"
    :disabled="isSaving"
  >
    <span class="icn-item icn-google icn-size_lg"></span>Sign in with Google
  </GoogleLogin>
</template>

<script>
import GoogleLogin from "vue-google-login";

export default {
  name: "GoogleLoginButton",
  components: {
    GoogleLogin
  },
  props: {
    largeControls: {
      type: Boolean,
      default: false
    },
    isSaving: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      params: {
        client_id: ""
      }
    };
  },
  methods: {
    onSuccess(googleUser) {
      const token = googleUser.getAuthResponse().id_token;
      this.$store.dispatch("auth/googleLogin", token);
    },
    onFailure(err) {
      console.log(err);
    }
  },
  mounted() {
    this.params.client_id = this.$store.state.init.data.loginSettings.google.publicKey;
  }
};
</script>
