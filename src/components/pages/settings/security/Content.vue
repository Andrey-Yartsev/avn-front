<template>
  <div class="SettingsSecurityView">
    <form v-on:submit.stop.prevent="confirmOtp">
      <h1 class="form-title" v-if="$mq === 'desktop'">
        Security
      </h1>
      <div class="form-title border-top">
        <div class="inner">
          <span class="semi-transparent">
            Two step verification
            <p class="subtext two-step-text">
              Turn on to make your account more secure
            </p>
          </span>
          <label class="toggle-element">
            <input type="checkbox" class="otpEnable" v-model="otpEnable" />
            <span></span>
          </label>
        </div>
      </div>

      <div class="otp-block">
        <div class="shadow-block">
          <template v-if="otpEnable && !user.otpEnable">
            <div class="label">
              Google Authenticator setup
            </div>
            <ol>
              <li>
                <p>
                  Download and install Google Authenticator app from
                  <a
                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                    rel="nofollow"
                    target="_blank"
                    >Google Play</a
                  >
                  or
                  <a
                    href="https://itunes.apple.com/ru/app/google-authenticator/id388497605"
                    rel="nofollow"
                    target="_blank"
                    >App Store</a
                  >
                </p>
              </li>
              <li>
                <p>
                  In Google Authenticator app open “Settings“ and select “Set up
                  account“
                </p>
              </li>
              <li>
                <p>Select “Scan a barcode“ or “Enter provided key“</p>
                <div class="code-wrapper">
                  <div class="code-text" v-if="otp.code">
                    <span class="code">{{ otp.code }}</span>
                    <button
                      @click="copyKey"
                      type="button"
                      class="btn border alt copy-code"
                    >
                      Copy key
                    </button>
                  </div>
                  <span class="qr-code" v-if="otp.qrUrl"
                    ><img :src="otp.qrUrl"
                  /></span>
                </div>
              </li>
              <li>
                <p>Enter code from your Google Authenticator</p>
                <input type="text" name="otpCode" v-model="otpCode" />
              </li>
            </ol>
            <button
              v-if="
                (otpEnable && !user.otpEnable) || (!otpEnable && user.otpEnable)
              "
              type="submit"
              class="btn lg saveChanges hidden-mobile"
              :disabled="!otpCode"
            >
              Confirm
            </button>
          </template>
          <div v-if="!otpEnable && user.otpEnable" class="form-group full">
            <label class="form-group-inner">
              <span class="label">
                Enter code from your Google Authenticator
              </span>
              <input type="text" name="otpCode" v-model="otpCode" />
            </label>
            <div class="input-help semi-transparent">
              Turning off two factor verification will make your account less
              secure
            </div>
          </div>
        </div>
      </div>

      <div class="SessionsCollectionView">
        <div class="form-title border-top">
          <div class="inner">
            <span class="semi-transparent">Sessions</span>
            <button
              v-if="sessions.length"
              type="button"
              class="close-all-sessions-btn"
              @click="deleteAllSessions"
            >
              Close all
            </button>
          </div>
        </div>
        <div class="session-content">
          <div class="loader-container" v-if="loading">
            <Loader :fullscreen="false" text="" class="transparent small" />
          </div>

          <div class="content shadow-block" v-else-if="sessions.length">
            <div class="SessionsView" v-for="v in sessions" v-bind:key="v.id">
              <div class="session-info-header">
                <p>
                  <span class="browser">{{ v.client }}</span>
                  <span class="os">{{ v.os }}</span>
                </p>
                <span class="status">
                  <span class="last-activity" v-if="!v.isCurrent">{{
                    getActivityTime(v.lastActivity)
                  }}</span>
                  <span class="online" v-else>Online</span>
                </span>
                <button
                  type="button"
                  class="delete"
                  @click="deleteSession(v)"
                ></button>
              </div>
              <div class="session-info-details">
                <p class="ip-country">
                  {{ v.ipAddress }} - {{ v.countryName }}
                </p>
              </div>
            </div>
          </div>
          <div class="empty-table-info shadow-block" v-else>
            <span>Empty here for now</span>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Common from "../common";
import Loader from "@/components/common/Loader";
import Auth from "@/utils/auth";
import datetimeHelper from "@/helpers/datetime";

export default {
  name: "SecuritySettingsContent",

  mixins: [Common],

  components: {
    Loader
  },

  data() {
    return {
      otpEnable: false
    };
  },

  computed: {
    sessions() {
      return this.$store.state.sessions.sessions;
    },
    otp() {
      return this.$store.state.otp;
    },
    otpCode: {
      set(code) {
        this.$store.commit("otp/setCurrentCode", code);
      },
      get() {
        return this.$store.state.otp.currentCode;
      }
    },
    loading() {
      return this.$store.state.sessions.fetchLoading;
    }
  },

  watch: {
    user() {
      this.otpCode = "";
    }
  },

  mounted() {
    this.otpEnable = this.user.otpEnable;
    this.$store.dispatch("sessions/fetch");
    this.$store.dispatch("otp/fetchInitCodes");
  },

  methods: {
    otpSaveHandler() {
      this.confirmOtp();
    },
    confirmOtp() {
      if (this.user.otpEnable) {
        this.$store.dispatch("otp/deleteCode", this.otpCode);
        setTimeout(() => {
          this.$store.dispatch("otp/fetchInitCodes");
        }, 3000);
      } else {
        this.$store.dispatch("otp/updateProfile", this.otpCode);
      }
    },
    deleteSession(session) {
      this.$store.dispatch("sessions/delete", session.id).then(() => {
        if (session.isCurrent) {
          Auth.logout();
        }
      });
    },
    deleteAllSessions() {
      if (!confirm("Are you sure?")) {
        return;
      }
      this.$store.dispatch("sessions/deleteAll").then(() => {
        Auth.logout();
      });
    },
    copyKey() {
      this.$copyText(this.otp.code);
    },
    getActivityTime(time) {
      return datetimeHelper(time);
    }
  },

  created: function() {
    window.addEventListener("saveProfile", this.otpSaveHandler);
  },

  beforeDestroy() {
    window.removeEventListener("saveProfile", this.otpSaveHandler);
  }
};
</script>

<style>
.empty-table-info {
  display: block;
}
</style>
