<template>
  <div class="settings">
    <div class="settings-header" v-if="$mq === 'mobile'">
      <router-link
        :to="returnRoute"
        class="header-return-btn go-back go-back_arrow header-return-btn_icn-abs"
      />

      <h1 class="page-title">
        <slot name="title">{{ title }}</slot>
      </h1>

      <router-link
        to="/logout"
        class="link-title btn-logout icn-item icn-size_lg icn-pos_center"
        v-if="showLogoutButton"
      />

      <button
        class="btn sm header-apply-btn"
        :disabled="!changed"
        v-if="showSaveButton"
        @click="save"
      >
        Save
      </button>
    </div>
    <div class="container">
      <div class="row">
        <div class="content-col" :class="{ 'hidden-mobile': isHome }">
          <div class="rounded-container">
            <slot name="content" />
          </div>
        </div>
        <Aside />
      </div>
    </div>
  </div>
</template>

<script>
import Aside from "./Aside";
import DefaultSection from "./default/Content";
import MobileMixin from "@/mixins/settings/mobile";
import User from "@/mixins/user";

export default {
  name: "Settings",

  mixins: [MobileMixin, User],

  components: {
    Aside,
    DefaultSection
  },

  data() {
    return {
      title: ""
    };
  },

  computed: {
    isAccountPage() {
      return this.$route.name === "SettingsAccount";
    },
    isPrivacyPage() {
      return this.$route.name === "SettingsPrivacy";
    },
    showLogoutButton() {
      return (
        this.isAccountPage &&
        (this.$route.params.view === "manage" || !this.$route.params.view)
      );
    },
    showSaveButton() {
      if (
        this.isAccountPage &&
        this.$route.params.view &&
        this.$route.params.view !== "manage" &&
        this.$route.params.view !== "email"
      ) {
        return true;
      }
      return (
        [
          "SettingsProfile",
          "SettingsStory",
          "SettingsPrivacy",
          "SettingsSecurity",
          "SettingsNotifications"
        ].indexOf(this.$route.name) !== -1
      );
    },
    changed() {
      if (this.$route.name === "SettingsSecurity") {
        return !!this.$store.state.otp.currentCode;
      }
      return this.$store.state.profile.changed;
    },
    returnRoute() {
      if (this.isAccountPage) {
        if (this.$route.params.view) {
          return "/settings/account";
        } else {
          return "/settings";
        }
      } else if (this.isPrivacyPage) {
        if (this.$route.params.view) {
          return "/settings/privacy";
        } else {
          return "/settings";
        }
      } else if (this.$route.name === "SettingsStory") {
        if (this.$route.params.view) {
          return "/settings/story";
        } else {
          return "/settings";
        }
      }
      if (this.$route.name === "Settings") {
        return "/";
      } else {
        return "/settings";
      }
    }
  },

  methods: {
    save() {
      window.dispatchEvent(new Event("saveProfile"));
    },
    accountViewToTitle(view) {
      const map = {
        email: "Email",
        twitter: "Twitter",
        password: "Password",
        manage: "Manage Account"
      };
      return map[view];
    },
    changeTitle(title) {
      this.title = title;
    },
    initTitle() {
      if (!this.$route.meta.title) {
        return;
      }
      this.changeTitle(this.$route.meta.title.toString());
    }
  },

  mounted() {
    this.initTitle();
  }
};
</script>
