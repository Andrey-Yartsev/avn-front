<template>
  <div class="SettingsSecurityView">
    <form v-on:submit.stop.prevent="confirmOtp">
      <h1 class="form-title settings-title" v-if="$mq === 'desktop'">
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
            <span class="toggle-element_switcher"></span>
          </label>
        </div>
      </div>

      <div class="otp-block">
        <div class="shadow-block">
          <template v-if="otpEnable && !user.otpEnable">
            <div class="label">
              Google Authenticator setup
            </div>
            <ol class="otp-block__list">
              <li class="otp-block__item">
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
              <li class="otp-block__item">
                <p>
                  In Google Authenticator app open “Settings“ and select “Set up
                  account“
                </p>
              </li>
              <li class="otp-block__item">
                <p>Select “Scan a barcode“ or “Enter provided key“</p>
                <div class="code-wrapper">
                  <div class="code-text" v-if="otp.code">
                    <span class="code">{{ otp.code }}</span>
                    <button
                      v-if="copied"
                      type="button"
                      class="btn"
                      :class="{ 'border alt copy-code': $mq === 'desktop' }"
                    >
                      Copied!
                    </button>
                    <button
                      v-else
                      @click="copyKey"
                      type="button"
                      class="btn"
                      :class="{ 'border alt copy-code': $mq === 'desktop' }"
                    >
                      Copy key
                    </button>
                  </div>
                  <span class="qr-code" v-if="otp.qrUrl"
                    ><img :src="otp.qrUrl"
                  /></span>
                </div>
              </li>
              <li class="otp-block__item">
                <p>Enter code from your Google Authenticator</p>
                <input type="text" name="otpCode" v-model="otpCode" />
              </li>
            </ol>
            <button
              v-if="
                (otpEnable && !user.otpEnable) || (!otpEnable && user.otpEnable)
              "
              type="submit"
              class="btn lg btn_fix-width hidden-mobile"
              :disabled="!otpCode"
            >
              Confirm
            </button>
          </template>
          <template v-if="!otpEnable && user.otpEnable">
            <div class="form-group form-group_with-label full">
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
            <div class="form-group form-group_clear-gaps">
              <button
                type="submit"
                class="btn lg btn_fix-width"
                :disabled="!otpCode"
              >
                Confirm
              </button>
            </div>
          </template>
        </div>
      </div>

      <div class="SessionsCollectionView">
        <div
          class="form-title"
          :class="{
            'border-top-mobile':
              !otpEnable && !user.otpEnable && $mq === 'mobile',
            'border-top': $mq === 'desktop'
          }"
        >
          <div class="inner">
            <span class="semi-transparent">Sessions</span>
            <button
              v-if="sessions.length"
              type="button"
              class="close-all-sessions-btn delete-session delete-session_all icn-item"
              @click="deleteAllSessions"
            >
              Close all
            </button>
          </div>
        </div>
        <div class="session-content shadow-block shadow-block_reset-pt">
          <div class="loader-infinity" v-if="loading">
            <Loader :fullscreen="false" :inline="true" text="" :small="true" />
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
                  class="delete-session delete-session_single icn-item"
                  @click="deleteSession(v)"
                  v-tooltip="'Delete session'"
                ></button>
              </div>
              <div class="session-info-details">
                <p class="ip-country semi-transparent">
                  {{ v.ipAddress }} - {{ v.countryName }}
                </p>
              </div>
            </div>
          </div>
          <div class="empty-table-info show" v-else>
            <span>Empty here for now</span>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import SettingsCommonMixin from "@/mixins/settings/common";
import Loader from "@/components/common/Loader";
import { fromNow } from "@/helpers/datetime";

export default {
  name: "SecuritySettingsContent",

  mixins: [SettingsCommonMixin],

  components: {
    Loader
  },

  data() {
    return {
      otpEnable: false,
      copied: false
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
    if (!this.otpEnable) {
      this.$store.dispatch("otp/fetchInitCodes");
    }
  },

  methods: {
    otpSaveHandler() {
      this.confirmOtp();
    },
    confirmOtp() {
      if (this.user.otpEnable) {
        this.$store.dispatch("otp/deleteCode", this.otpCode).catch(() => {
          this.otpCode = "";
        });
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
          this.$router.replace("/logout");
        }
      });
    },
    deleteAllSessions() {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "Remove all sessions",
          success: this.removeSessions
        }
      });
    },
    copyKey() {
      this.$copyText(this.otp.code).then(() => {
        this.copied = true;
        setTimeout(() => (this.copied = false), 1000);
      });
    },
    getActivityTime(time) {
      return fromNow(time);
    },
    removeSessions() {
      this.$store.dispatch("sessions/deleteAll").then(() => {
        this.$router.replace("/logout");
      });
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
