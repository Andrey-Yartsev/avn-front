<template>
  <div class="AccountAllView">
    <div class="form-title form-title_cols">
      <h1 class="settings-title">
        {{ user.name }}
      </h1>
      <router-link to="/logout" class="link-title">Log out</router-link>
    </div>

    <Email />

    <div class="border-top twitter-block">
      <ConnectTwitter @connected="twitterConnected" />
    </div>

    <div class="border-top google-block">
      <ConnectGoogle />
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
                <span class="form-field">
                  <input
                    type="password"
                    class="checkPass"
                    name="oldPassword"
                    v-model="oldPassword"
                  />
                </span>
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
                <span class="form-field">
                  <input
                    type="password"
                    class="checkPass"
                    name="newPassword"
                    v-model="newPassword"
                  />
                </span>
              </span>
            </label>
          </div>

          <div class="form-group form-group_with-label">
            <label class="form-group-inner">
              <span class="label">Confirm new password</span>
              <span class="form-group form-group_clear-gaps">
                <span class="form-field">
                  <input
                    type="password"
                    class="checkPass"
                    name="checkPassword"
                    v-model="checkPassword"
                  />
                </span>
              </span>
            </label>
          </div>
          <div class="form-group-btn hidden-mobile">
            <button
              type="submit"
              class="btn lg btn_fix-width"
              :disabled="!canChangePassword || passwordSaving"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
      <div class="text-centered hidden-desktop" v-if="$mq === 'mobile'">
        <button
          class="btn lg btn_not-bold btn_fix-width btn_fix-width_mob-lg saveChanges"
          type="submit"
          :disabled="!canChangePassword"
        >
          Save new password
        </button>
      </div>
    </form>
    <div class="form-title hidden-desktop" v-if="$mq === 'mobile'">
      <div class="inner text-centered">
        <span class="semi-transparent">{{ user.username }}</span>
      </div>
    </div>

    <DeleteRestore />
  </div>
</template>

<script>
import ConnectTwitter from "../ConnectTwitter";
import ConnectGoogle from "../ConnectGoogle";
import Common from "../common";
import DeleteRestore from "../DeleteRestore";
import Email from "./Email";

export default {
  name: "AccountSettingsAllView",

  mixins: [Common],

  data() {
    return {
      checkPassword: "",
      newPassword: "",
      oldPassword: "",
      passwordSaving: false
    };
  },

  components: {
    ConnectTwitter,
    DeleteRestore,
    Email,
    ConnectGoogle
  },

  computed: {
    changePasswordError() {
      return this.$store.state.user.changePasswordError;
    },
    canChangePassword() {
      if (!this.user.hasPassword) {
        return this.checkPassword && this.newPassword;
      }
      return this.checkPassword && this.newPassword && this.oldPassword;
    }
  },

  watch: {
    changePasswordError(error) {
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
    twitterConnected() {
      this.$router.push("/settings/account");
    },
    changePassword() {
      this.passwordSaving = true;
      this.$store
        .dispatch("user/changePassword", {
          checkPassword: this.checkPassword,
          newPassword: this.newPassword,
          oldPassword: this.oldPassword
        })
        .then(() => {
          this.passwordSaving = false;
          this.$store.dispatch("global/flashToast", {
            text: "Password has changed successfully"
          });
          this.checkPassword = "";
          this.newPassword = "";
          this.oldPassword = "";
        })
        .catch(() => {
          this.passwordSaving = false;
        });
    }
  }
};
</script>
