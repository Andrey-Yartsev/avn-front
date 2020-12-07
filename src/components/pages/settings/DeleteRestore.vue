<template>
  <div class="border-top shadow-block delete-account-block">
    <div class="container">
      <div class="form-group form-group_with-label delete-account">
        <div class="input-help" v-if="!user.deleteRequested">
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
          Your account and all associated info will be permanently deleted from
          our servers!
        </div>
        <div class="input-help" v-else>
          <div class="input-help__title">
            <button
              type="button"
              class="delete-account-btn"
              @click="restoreAccount"
              :disabled="restoring"
            >
              Restore account
              <span class="user-login"
                ><span class="username">{{ user.username }}</span>
              </span>
            </button>
          </div>
          User will be removed after subscriptions expiration
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SettingsCommonMixin from "@/mixins/settings/common";

export default {
  mixins: [SettingsCommonMixin],
  computed: {
    restoring() {
      return this.$store.state.user.updateLoading;
    }
  },
  methods: {
    deleteAccount() {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title:
            "Your account and all associated info will be permanently deleted from our servers!",
          success: () => {
            this.$store
              .dispatch("user/_deleteAccount", this.$store.state.auth.token)
              .then(() => {
                this.$store.dispatch("global/flashToast", "Account deleted!");
                this.$router.push("/logout");
              })
              .catch(error => {
                this.$store.dispatch("global/setError", {
                  title: "Scheduled for deletion",
                  message: error.message
                });
                this.replaceProps({ deleteRequested: true });
              });
          }
        }
      });
    },
    restoreAccount() {
      this.updateProps({
        deleteRequested: false
      });
    }
  }
};
</script>
