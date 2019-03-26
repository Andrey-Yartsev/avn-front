<template>
  <div class="AccountAllView">
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
                <span class="form-field">
                  <input
                    class="input-email"
                    name="email"
                    v-model="localUser.email"
                  />
                </span>
              </span>
            </label>
          </div>
          <div
            class="form-group-btn hidden-mobile email-confirm-block"
            id="confirm-email-block"
            v-if="$mq === 'desktop'"
          >
            <button
              v-if="!user.emailChecked"
              type="button"
              class="btn border btn_fix-width-lg btn-confirm-email"
              @click="resendEmail"
            >
              Re-send confirmation email
            </button>
          </div>
          <!--
            <div class="form-group hidden-mobile email-confirm-block hidden" id="change-email-block">
              <div class="form-group-inner">
                <span class="label"></span>
                <button type="button" class="btn border btn_fix-width-lg btn-confirm-email">Save new email</button>
              </div>
            </div>
            -->
        </div>
      </div>

      <div
        class="text-centered hidden-desktop email-confirm-block"
        v-if="$mq === 'mobile'"
      >
        <button
          v-if="!user.emailChecked"
          type="button"
          class="btn lg border btn_fix-width-lg btn-confirm-email"
          id="confirm-email-block-mobile"
          @click="resendEmail"
        >
          Re-send confirmation email
        </button>
        <!--
          <button
            type="button"
            class="btn lg border btn_fix-width-lg btn-confirm-email hidden"
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
    <div class="border-top shadow-block delete-account-block">
      <div class="container">
        <div class="form-group form-group_with-label delete-account">
          <div class="input-help">
            <div class="input-help__title">
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
            </div>
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
      oldPassword: "",
      passwordSaving: false
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
      this.passwordSaving = true;
      this.$store
        .dispatch("user/changePassword", {
          checkPassword: this.checkPassword,
          newPassword: this.newPassword,
          oldPassword: this.oldPassword
        })
        .then(() => {
          this.passwordSaving = false;
          this.$store.dispatch(
            "global/flashToast",
            "Password has changed successfully"
          );
          this.checkPassword = "";
          this.newPassword = "";
          this.oldPassword = "";
        })
        .catch(() => {
          this.passwordSaving = false;
        });
    },
    deleteAccount() {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title:
            "Your account and all associated info will be permanently deleted from our servers!",
          success: () => {
            this.$store
              .dispatch("user/deleteAccount", this.$store.state.auth.token)
              .then(() => {
                this.$router.push("/logout");
              });
          }
        }
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
