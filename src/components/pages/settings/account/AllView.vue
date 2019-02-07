<template>
  <div class="AccountAllView" v-if="$mq === 'desktop'">
    <div class="form-title form-title_cols">
      <h1>
        {{ user.name }}
      </h1>
      <router-link to="/logout" class="link-title btn-logout"
        >Log out</router-link
      >
    </div>

    <div class="border-top email-block">
      <div class="shadow-block">
        <div class="container">
          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">
                <span class="for-verified" v-if="user.emailChecked"
                  >Your email</span
                >
                <span class="for-unverified" v-else-if="!user.emailChecked"
                  >Please confirm your email</span
                >
              </span>
              <span
                class="form-group form-group_clear-gaps"
                :class="{
                  'field-valid': user.emailChecked,
                  'field-invalid no-border': !user.emailChecked
                }"
              >
                <input
                  class="input-email"
                  name="email"
                  v-model="localUser.email"
                  disabled
                />
              </span>
            </label>
          </div>
          <div
            class="form-group form-group_with-label hidden-mobile email-confirm-block"
            id="confirm-email-block"
          >
            <div class="form-group-inner">
              <span class="label"></span>
              <button
                v-if="!user.emailChecked"
                type="button"
                class="btn border btn-confirm-email"
                @click="resendEmail"
              >
                Re-send confirmation email
              </button>
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
        >
          Re-send confirmation email
        </button>
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
      <ConnectTwitter @connected="twitterConnected" />
    </div>

    <form
      class="settings-form password-form"
      v-on:submit.stop.prevent="changePassword"
    >
      <div class="form-title border-top">
        <div class="inner">
          <span class="semi-transparent">Change or reset password</span>
        </div>
      </div>
      <div class="shadow-block">
        <div class="container">
          <div class="form-group form-group_with-label" v-if="user.hasPassword">
            <label class="form-group-inner">
              <span class="label">Old password</span>
              <span class="form-group form-group_clear-gaps">
                <input
                  type="password"
                  class="checkPass"
                  name="oldPassword"
                  v-model="oldPassword"
                />
              </span>
            </label>
            <div class="input-help">
              <router-link to="/forgot">Forgot your password?</router-link>
            </div>
          </div>
          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">New password</span>
              <span class="form-group form-group_clear-gaps">
                <input
                  type="password"
                  class="checkPass"
                  name="newPassword"
                  v-model="newPassword"
                />
              </span>
            </label>
          </div>

          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">Confirm new password</span>
              <span class="form-group form-group_clear-gaps">
                <input
                  type="password"
                  class="checkPass"
                  name="checkPassword"
                  v-model="checkPassword"
                />
              </span>
            </label>
          </div>
          <div class="form-group-btn hidden-mobile">
            <button
              type="submit"
              class="btn lg saveChanges"
              :disabled="!canChangePassword"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
      <div class="text-centered hidden-desktop">
        <button
          class="btn lg saveChanges"
          type="submit"
          :disabled="!canChangePassword"
        >
          Save new password
        </button>
      </div>
    </form>
    <div class="form-title hidden-desktop">
      <div class="inner text-centered">
        <span class="semi-transparent">{{ user.username }}</span>
      </div>
    </div>
    <div class="border-top shadow-block delete-account-block">
      <div class="container">
        <div class="form-group form-group_with-label delete-account">
          <label class="form-group-inner">
            <span class="label hidden-mobile"></span>
            <button
              type="button"
              class="delete-account-btn"
              @click="deleteAccount"
            >
              Delete account
              <span class="user-login"
                ><span class="username">{{ user.username }}</span>
              </span>
            </button>
          </label>
          <div class="input-help">
            Your account and all associated info will be permanently deleted
            from our servers!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConnectTwitter from "../ConnectTwitter";
import Common from "../common";

export default {
  name: "AccountSettingsAllView",

  mixins: [Common],

  data() {
    return {
      checkPassword: "",
      newPassword: "",
      oldPassword: ""
    };
  },

  components: {
    ConnectTwitter
  },

  computed: {
    changePasswordError() {
      return this.$store.state.user.changePasswordError;
    },
    canChangePassword() {
      return this.checkPassword && this.newPassword && this.oldPassword;
    }
  },

  watch: {
    changePasswordError(error) {
      if (!error) {
        return;
      }
      this.$store.dispatch("global/flashToast", error.message);
    }
  },

  methods: {
    twitterConnected() {
      this.$router.push("/settings/account");
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
      if (
        !window.confirm(
          "Are you sure? Your account and all associated info will be permanently deleted from our servers!"
        )
      ) {
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
  }
};
</script>
