<template>
  <div class="AccountView">
    <div class="hidden-desktop">
      <div class="form-title">
        <div class="inner">
          <span class="semi-transparent">Login</span>
        </div>
      </div>
      <div class="shadow-block no-padding">
        <div class="settings-nav">
          <a href="/settings/account/email" class="warning">
            <span>Email</span>
            <span class="value">{{ user.email }}</span></a>
          <a href="/settings/account/twitter">
            <span>Twitter</span>
            <span class="value">Connect</span>
          </a>
        </div>
      </div>
      <div class="form-title">
        <div class="inner">
          <span class="semi-transparent">Password</span>
        </div>
      </div>
      <div class="shadow-block no-padding">
        <div class="settings-nav">
          <a href="/settings/account/password" class=""><span>Change or reset your password</span></a>
        </div>
      </div>
      <div class="form-title">
        <div class="inner">
          <span class="semi-transparent">Manage Account</span>
        </div>
      </div>
      <div class="shadow-block no-padding">
        <div class="settings-nav">
          <router-link to="/settings/account/manage">
            <span class="user-login">{{ user.name }}</span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="hidden-mobile">
      <div class="AccountAllView">
        <div class="form-title form-title_cols">
          <h1>
            {{ user.name }}
          </h1>
          <router-link to="/logout" class="link-title btn-logout">Log out</router-link>
        </div>

        <div
          class="border-top email-block"
          :class="{'success': user.emailChecked, 'warnging': !user.emailChecked}"
        >
          <div class="shadow-block">
            <div class="container">
              <div class="form-group">
                <label class="form-group-inner">
                  <span class="label">
                    <span class="for-verified">Your email</span>
                    <span class="for-unverified">Please confirm your email</span></span>
                  <input
                    class="input-email" name="email" v-model="localUser.email"
                    disabled
                  >
                </label>
              </div>
              <div class="form-group hidden-mobile email-confirm-block" id="confirm-email-block">
                <div class="form-group-inner">
                  <span class="label"></span>
                  <button
                    v-if="!user.emailChecked"
                    type="button"
                    class="btn border btn-confirm-email"
                    @click="resendEmail"
                  >Re-send confirmation email</button>
                </div>
              </div>
              <!--
              <div class="form-group hidden-mobile email-confirm-block hidden" id="change-email-block">
                <div class="form-group-inner">
                  <span class="label"></span>
                  <button type="button" class="btn border btn-confirm-email">Save new email</button>
                </div>
              </div>
              -->
            </div>
          </div>

          <div class="text-centered hidden-desktop email-confirm-block">
            <button
              v-if="!user.emailChecked"
              type="button"
              class="btn lg border btn-confirm-email"
              id="confirm-email-block-mobile"
              @click="resendEmail"
            >Re-send confirmation email</button>
            <!--
            <button
              type="button"
              class="btn lg border btn-confirm-email hidden"
              id="change-email-block-mobile"
            >Save new email</button>
            -->
          </div>
        </div>
        <div class="border-top twitter-block">
          <div class="TwitterBlockView">
            <div class="shadow-block">
              <div class="container">
                <div class="form-group">
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
        </div>

        <form class="settings-form password-form" v-on:submit.stop.prevent="changePassword">
          <div class="form-title border-top">
            <div class="inner">
              <span class="semi-transparent">Change or reset password</span>
            </div>
          </div>
          <div class="shadow-block">
            <div class="container">

              <div class="form-group">
                <label class="form-group-inner">
                  <span class="label">Old password</span>
                  <input
                    type="password" class="checkPass" name="oldPassword"
                    v-model="oldPassword"
                  >
                </label>
                <div class="input-help">
                  <router-link to="/forgot">Forgot your password?</router-link></div>
              </div>
              <div class="form-group">
                <label class="form-group-inner">
                  <span class="label">New password</span>
                  <input
                    type="password" class="checkPass" name="newPassword"
                    v-model="newPassword"
                  >
                </label>
              </div>

              <div class="form-group">
                <label class="form-group-inner">
                  <span class="label">Confirm new password</span>
                  <input
                    type="password" class="checkPass" name="checkPassword"
                    v-model="checkPassword"
                  >
                </label>
              </div>
              <div class="form-group-btn hidden-mobile">
                <button
                  type="submit" class="btn lg saveChanges"
                  :disabled="!canChangePassword"
                >Save changes</button>
              </div>
            </div>
          </div>
          <div class="text-centered hidden-desktop">
            <button
              class="btn lg saveChanges" type="submit"
              :disabled="!canChangePassword"
            >Save new password</button>
          </div>
        </form>
        <div class="border-top shadow-block delete-account-block">
          <div class="container">
            <div class="form-group delete-account">
              <label class="form-group-inner">
                <span class="label"></span>
                <button
                  type="button" class="delete-account-btn"
                  @click="deleteAccount"
                >
                  Delete account
                  <span class="user-login"><span class="username">{{ user.username }}</span>
                </span></button>
              </label>
              <div class="input-help">Your account and all associated info will be permanently deleted from our
                servers!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Common from "../common";
import Twitter from "@/utils/twitter";

export default {
  name: "AccountSettingsContent",

  mixins: [Common],

  data() {
    return {
      checkPassword: "",
      newPassword: "",
      oldPassword: ""
    };
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
        // extendUser
      });
    },
    changePassword() {
      this.$store
        .dispatch("user/changePassword", {
          checkPassword: this.checkPassword,
          newPassword: this.newPassword,
          oldPassword: this.oldPassword
        })
        .then(() => {
          this.$store.dispatch(
            "global/flashToast",
            "Password has changed successfully"
          );
          this.checkPassword = "";
          this.newPassword = "";
          this.oldPassword = "";
        });
    },
    deleteAccount() {
      if (!window.confirm("Are you sure?")) {
        return;
      }
      this.$store
        .dispatch("user/deleteAccount", this.$store.state.auth.token)
        .then(() => {
          this.$router.push("/logout");
        });
    },
    resendEmail() {
      this.$store.dispatch("emails/resend", this.localUser.email).then(() => {
        this.$store.dispatch("global/flashToast", "Email sent");
      });
    }
  },

  computed: {
    twitterError() {
      return this.$store.state.twitter.connectError;
    },
    changePasswordError() {
      return this.$store.state.user.changePasswordError;
    },
    canChangePassword() {
      return this.checkPassword && this.newPassword && this.oldPassword;
    }
  },

  watch: {
    twitterError(error) {
      if (!error) {
        return;
      }
      this.$store.dispatch("global/flashToast", error.message);
    },
    changePasswordError(error) {
      if (!error) {
        return;
      }
      this.$store.dispatch("global/flashToast", error.message);
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
          this.$router.push("/settings/account");
        });
    }
  }
};
</script>
