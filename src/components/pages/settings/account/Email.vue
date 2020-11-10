<template>
  <div class="border-top email-block">
    <div class="shadow-block">
      <div class="container">
        <div class="form-group form-group_with-label" v-if="user.emailChecked">
          <label class="form-group-inner">
            <span class="label">
              <span class="for-verified" v-if="user.emailChecked"
                >Current email</span
              >
              <span class="for-unverified" v-else-if="!user.emailChecked"
                >Please confirm your email</span
              >
            </span>
            <span
              class="form-group form-group_clear-gaps"
              :class="{
                'field-valid': user.emailChecked,
                'field-invalid no-border': !user.emailNew && !user.emailChecked
              }"
            >
              <span class="form-field">
                <input
                  class="input-email"
                  :value="currentEmail"
                  :disabled="user.email"
                />
              </span>
            </span>
          </label>
        </div>

        <div class="form-group form-group_with-label">
          <label class="form-group-inner">
            <span class="label">New email</span>
            <span class="form-group form-group_clear-gaps" :class="{}">
              <span class="form-field">
                <input
                  class="input-email"
                  name="email"
                  v-model="newEmail"
                  v-validate="'email'"
                  :disabled="sendingEmail"
                  ref="email"
                />
              </span>
            </span>
          </label>

          <div
            class="input-help hint-text-sm"
            v-if="newEmail && fieldError('email')"
          >
            {{ fieldError("email") }}
          </div>
          <template v-else>
            <div class="input-help hint-text-sm" v-if="user.emailNew">
              New email address <b>{{ user.emailNew }}</b> is not confirmed yet
            </div>
            <div
              class="input-help hint-text-sm"
              v-else-if="!user.emailChecked && !newEmail"
            >
              Registration email address <b>{{ user.email }}</b> is not
              confirmed yet
            </div>
          </template>

          <div class="input-help error-info" v-if="sendingError">
            {{ sendingError }}
          </div>
        </div>

        <div
          class="form-group-btn hidden-mobile email-confirm-block"
          id="confirm-email-block"
        >
          <button
            type="button"
            class="btn border btn_fix-width-lg btn-confirm-email"
            @click="sendEmail"
            :disabled="!canSend"
          >
            {{ user.emailChecked ? "Send" : "Re-send" }} confirmation email
          </button>
        </div>
      </div>
    </div>

    <div
      class="text-centered hidden-desktop email-confirm-block"
      v-if="$mq === 'mobile'"
    >
      <button
        type="button"
        class="btn lg border btn_fix-width-lg btn-confirm-email"
        id="confirm-email-block-mobile"
        @click="sendEmail"
        :disabled="!canSend"
      >
        {{ user.emailChecked ? "Send" : "Re-send" }} confirmation email
      </button>
    </div>
  </div>
</template>

<script>
import User from "@/mixins/user";
import Form from "@/mixins/form";

export default {
  name: "AccountSettingsEmail",
  mixins: [User, Form],
  data() {
    return {
      currentEmail: "",
      newEmail: ""
    };
  },
  computed: {
    sendingEmail() {
      return this.$store.state.emails.resendLoading;
    },
    sendingError() {
      if (!this.$store.state.emails.resendError) {
        return null;
      }
      return this.$store.state.emails.resendError.message;
    },
    emailToSend() {
      return this.newEmail || this.user.emailNew || this.user.email;
    },
    canSend() {
      if (this.newEmail) {
        return this.isFormValid;
      }
      return !this.sendingEmail;
    }
  },
  methods: {
    sendEmail() {
      if (!this.isFormValid) {
        return;
      }
      if (this.newEmail) {
        this.$root.ws.send({
          act: "check_new_email",
          email: this.emailToSend
        });
        this.newEmail = "";
      } else {
        this.$store.dispatch("emails/resend", this.emailToSend).then(r => {
          if (!r.success) {
            this.$store.dispatch("global/flashToast", {
              text: "Error on sending"
            });
            return;
          }
          this.$store.dispatch("profile/fetch");
          this.newEmail = "";
          this.$store.dispatch("global/flashToast", { text: "Email sent" });
        });
      }
    }
  },
  created() {
    this.currentEmail = this.user.email;
  }
};
</script>
