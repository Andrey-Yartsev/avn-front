<template>
  <div class="settings">
    <div class="settings-header">
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
        to="/logout" class="link-title btn-logout"
        v-if="showLogoutButton"
      ></router-link>

      <button
        class="btn sm header-apply-btn"
        :disabled="!changed"
        v-if="hasSaveButton"
        @click="save"
      >Save</button>

    </div>
    <div class="container">
      <div class="row">
        <div class="content-col" :class="{'hidden-mobile': isHome}">
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

export default {
  name: "Settings",

  mixins: [Mobile, User],

  components: {
    Aside,
    DefaultSection
  },

  computed: {
    isAccountPage() {
      return this.$route.name === "SettingsAccount";
    },
    showLogoutButton() {
      // todo: team2 has another logic
      return this.isAccountPage;
    },
    showUsernameAsTitle() {
      if (this.isAccountPage && !this.$route.params.view) {
        return true;
      }
      return false;
    },
    title() {
      if (this.isAccountPage) {
        return this.accountViewToTitle(this.$route.params.view);
      }
      return this.$route.meta.title;
    },
    hasSaveButton() {
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
      return this.$store.state.profile.changed;
    },
    returnRoute() {
      if (this.isAccountPage) {
        if (this.$route.params.view) {
          return "/settings/account";
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
    }
  }
};
</script>
