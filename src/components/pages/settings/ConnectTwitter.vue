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
              class="btn btn_reset-mgap alt border btn_fix-width-lg connect-twitter hidden-mobile"
              @click="twitterConnect"
            >
              Connect Twitter account
            </button>

            <template v-else>
              <span
                class="value twitter-value hidden-desktop"
                v-if="$mq === 'mobile'"
              >
                <a
                  :href="'https://twitter.com/' + user.twitterUsername"
                  target="_blank"
                  rel="nofollow"
                  >{{ user.twitterUsername }}</a
                >
              </span>
              <input
                class="rounded twitter-input hidden-mobile"
                type="text"
                readonly=""
                :value="'@' + user.twitterUsername"
                v-if="$mq === 'desktop'"
              />
              <button
                type="button"
                class="btn border disconnect-twitter hidden-mobile semi-transparent"
                @click="twitterDisconnect"
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
      <button
        v-if="!user.isTwitterConnected"
        type="button"
        class="btn btn_reset-mgap lg border btn_fix-width-lg connect-twitter"
        @click="twitterConnect"
      >
        Connect Twitter account
      </button>
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
      this.$store.dispatch("global/flashToast", {
        text: error.message,
        type: "error"
      });
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
            canSendTweets: false,
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
                canSendTweets: r.canSendTweets,
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
