<template>
  <div class="TwitterBlockView">
    <div class="shadow-block">
      <div class="container">
        <div class="form-group form-group_with-label">
          <div class="form-group-inner form-group-title">
            <span class="label">Your Twitter</span>

            <button
              v-if="!user.isTwitterConnected"
              type="button"
              class="btn border connect-twitter hidden-mobile"
              @click="twitterConnect"
            >Connect Twitter account</button>

            <template v-else>
              <span class="value twitter-value hidden-desktop">
                <a
                  :href="'https://twitter.com/' + user.twitterUsername" target="_blank" rel="nofollow"
                >{{ user.twitterUsername }}</a>
                </span>
              <input
                class="rounded twitter-input hidden-mobile" type="text" readonly=""
                :value="'@' + user.twitterUsername"
              >
              <button
                type="button"
                class="btn border disconnect-twitter hidden-mobile"
                @click="twitterDisconnect"
              >Disconnect</button>
            </template>

          </div>
        </div>
      </div>
    </div>
    <div class="hidden-desktop text-centered">
      <button
        v-if="!user.isTwitterConnected"
        type="button"
        class="btn lg border connect-twitter"
        @click="twitterConnect"
      >Connect Twitter account</button>
    </div>
  </div>
</template>

<script>
import Twitter from "@/utils/twitter";
import User from "@/mixins/user";

export default {
  name: "ConnectTwitter",

  mixins: [User],

  computed: {
    twitterError() {
      return this.$store.state.twitter.connectError;
    }
  },

  watch: {
    twitterError(error) {
      if (!error) {
        return;
      }
      this.$store.dispatch("global/flashToast", error.message);
    }
  },

  methods: {
    twitterConnect() {
      window.location.href = Twitter.getConnectUrl("/settings/account");
    },
    twitterDisconnect() {
      this.$store.dispatch("twitter/disconnect").then(() => {
        this.$store.dispatch(
          "auth/extendUser",
          {
            isTwitterConnected: false,
            twitterUsername: ""
          },
          { root: true }
        );
      });
    }
  },

  mounted() {
    const params = new URL(document.location).searchParams;
    if (params.get("token")) {
      this.$store
        .dispatch("twitter/connect", {
          token: params.get("token"),
          secret: params.get("secret")
        })
        .then(r => {
          if (!r.error) {
            this.$store.dispatch(
              "auth/extendUser",
              {
                isTwitterConnected: true,
                twitterUsername: r.twitterUsername
              },
              { root: true }
            );
          }
          this.$emit("connected");
        });
    }
  }
};
</script>
