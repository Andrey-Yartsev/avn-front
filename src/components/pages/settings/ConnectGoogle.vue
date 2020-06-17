<template>
  <div class="TwitterBlockView">
    <div class="shadow-block">
      <div class="container">
        <div class="form-group form-group_with-label">
          <div class="form-group-inner form-group-title">
            <span class="label">Your Google</span>

            <GoogleLogin
              v-if="!user.social.isGoogleConnected"
              class="btn btn_reset-mgap alt border btn_fix-width-lg connect-twitter hidden-mobile"
              :params="params"
              :onSuccess="onSuccess"
              :onFailure="onFailure"
            >
              Connect Google account
            </GoogleLogin>

            <template v-else>
              <span
                class="value google-value hidden-desktop"
                v-if="$mq === 'mobile'"
              >
                <span>{{ user.social.googleConnectedProfile }}</span>
              </span>
              <input
                class="rounded twitter-input hidden-mobile"
                type="text"
                readonly=""
                :value="user.social.googleConnectedProfile"
                v-if="$mq === 'desktop'"
              />
              <button
                type="button"
                class="btn border disconnect-twitter hidden-mobile semi-transparent"
                @click="googleDisconnect"
                v-if="$mq === 'desktop'"
              >
                Disconnect
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden-desktop text-centered" v-if="$mq === 'mobile'">
      <GoogleLogin
        v-if="!user.social.isGoogleConnected"
        class="btn btn_reset-mgap lg border btn_fix-width-lg connect-twitter"
        :params="params"
        :onSuccess="onSuccess"
        :onFailure="onFailure"
      >
        Connect Google account
      </GoogleLogin>
      <button
        v-else
        type="button"
        class="btn border lg btn_fix-width-lg disconnect-twitter semi-transparent"
        @click="googleDisconnect"
      >
        Disconnect
      </button>
    </div>
  </div>
</template>

<script>
// import Twitter from "@/utils/twitter";
import User from "@/mixins/user";
import GoogleLogin from "vue-google-login";

export default {
  name: "ConnectGoogle",
  components: {
    GoogleLogin
  },
  mixins: [User],
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
      this.googleConnect(token);
    },
    onFailure(err) {
      console.log(err);
    },
    googleConnect(token) {
      this.$store
        .dispatch("google/connect", { token })
        .then(res => {
          this.$store.dispatch(
            "auth/extendUser",
            {
              social: {
                isGoogleConnected: true,
                googleConnectedProfile: res.social.googleConnectedProfile
              }
            },
            { root: true }
          );
          this.$store.dispatch("global/flashToast", {
            text: "Google profile has been connected",
            type: "success"
          });
        })
        .catch(err => {
          this.$store.dispatch("global/flashToast", {
            text: err.message,
            type: "error"
          });
        });
    },
    googleDisconnect() {
      this.$store
        .dispatch("google/disconnect")
        .then(() => {
          this.$store.dispatch(
            "auth/extendUser",
            {
              social: {
                isGoogleConnected: false,
                googleConnectedProfile: ""
              }
            },
            { root: true }
          );
          this.$store.dispatch("global/flashToast", {
            text: "Google profile has been disconnected",
            type: "warning"
          });
        })
        .catch(err => {
          this.$store.dispatch("global/flashToast", {
            text: err.message,
            type: "error"
          });
        });
    }
  },
  mounted() {
    this.params.client_id = this.$store.state.init.data.loginSettings.google.publicKey;
  }
};
</script>
