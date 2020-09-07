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
      this.$emit("loginStart");
      this.$store
        .dispatch("auth/googleLogin", token)
        .then(() => {
          this.$emit("loginEnd");
          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
        })
        .catch(err => {
          this.$emit("loginEnd");
          this.$store.dispatch("global/flashToast", {
            text: err.message,
            type: "error"
          });
        });
    },
    onFailure(err) {
      console.log(err);
    }
  },
  mounted() {
    this.params.client_id = this.$store.state.init.data?.loginSettings.google.publicKey;
  }
};
</script>
