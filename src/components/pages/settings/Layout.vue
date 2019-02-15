<template>
  <div class="settings">
    <div class="settings-header" v-if="$mq === 'mobile'">
      <router-link :to="returnRoute" class="header-return-btn"></router-link>

      <h1 class="page-title">
        <template v-if="showUsernameAsTitle">
          <span class="page-title__username">
            {{ user.name }}
          </span>
        </template>
        <template v-else>
          <span class="page-title__category">
            {{ title }}
          </span>
        </template>
      </h1>

      <router-link
        to="/logout"
        class="link-title btn-logout"
        v-if="showLogoutButton"
      ></router-link>

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
          <div class="rounded-container rounded-container_fluid-height">
            <slot name="content" />
          </div>
          <div class="site-footer hidden-mobile">
            <div class="container"></div>
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
import Mobile from "./mobile";
import User from "@/mixins/user";
import ucFirst from "@/helpers/ucFirst";

export default {
  name: "Settings",

  mixins: [Mobile, User],

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
      return this.isAccountPage && !this.showSaveButton;
    },
    showUsernameAsTitle() {
      if (this.isAccountPage && !this.$route.params.view) {
        return true;
      }
      return false;
    },
    showSaveButton() {
      if (this.isAccountPage && this.$route.params.view) {
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
      if (this.$route.params.view && this.$route.params.view === "blocked") {
        this.changeTitle("Blocked Users");
        return;
      }
      if (this.isAccountPage) {
        this.changeTitle(this.accountViewToTitle(this.$route.params.view));
        return;
      } else if (this.isPrivacyPage) {
        if (this.$route.params.view) {
          this.changeTitle(ucFirst(this.$route.params.view));
          return;
        }
      }
      this.changeTitle(this.$route.meta.title.toString());
    }
  },

  mounted() {
    this.initTitle();
  }
};
</script>
