<template>
  <div class="aside-col aside-col_sticky">
    <div class="settings-aside">
      <div
        id="avatarBgAside"
        class="rounded-container white-bg-block"
        :class="{'hidden-mobile': !showAvatarBlock}"
      >
        <div class="settings-profile-images">
          <div class="bg"></div>
          <div class="avatar-block">
            <span class="avatar"><img :src="user.avatar" v-if="user.avatar"/></span>
            <label for="avatar" class="select-user-image"></label>
            <input type="file" id="avatar">
            <span class="reset-user-image reset-avatar"></span>
          </div>
          <span class="reset-user-image reset-bg"></span>
          <label for="bg" class="select-user-image">
            <span class="select-user-image__text">
                Add Background Picture
            </span>
          </label>
          <input type="file" id="bg">
        </div>
        <div class="profile-identifier">
          <div class="profile-name profile-name-settings">
            <div class="profile-name__main">
              <span class="name">{{ user.name }}</span>
              <span class="verified-user" v-if="user.isVerified"></span>
            </div>
            <span class="user-login"><a :href="'/' + user.username">{{ user.username }}</a></span>
          </div>
          <div class="profile-picture-btns">
            <button class="btn-cancel-changes cancel-changes"></button>
            <button class="btn save-changes">Save changes</button>
          </div>
        </div>
      </div>
      <div class="rounded-container" :class="{'hidden-mobile': !isHome}">
        <div class="form-title hidden-desktop">
          <div class="inner">
            <span class="semi-transparent">
              {{ user.name }}
            </span>
          </div>
        </div>
        <div class="shadow-block no-padding">
          <div class="settings-nav">
            <router-link :to="'/settings/' + v.name" :class="navClass(v.name)"
               v-for="v in navigation"
               v-bind:key="v.name"
               class="settings-nav__item"
            >
              <span>{{ v.title }}</span>
            </router-link>
          </div>
        </div>
      </div>

      <Footer v-if="isHome" />
    </div>
  </div>
</template>

<script>
import Mobile from "./mobile";
import Footer from "@/components/footer/Index";

export default {
  name: "SettingsAside",

  mixins: [Mobile],

  components: {
    Footer
  },

  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    showAvatarBlock() {
      return this.$route.name === "SettingsProfile";
    },
    navigation() {
      return [
        {
          name: "profile",
          title: "Edit Profile"
        },
        {
          name: "account",
          title: "Account"
        },
        {
          name: "story",
          title: "Story Settings"
        },
        {
          name: "privacy",
          title: "Privacy"
        },
        {
          name: "security",
          title: "Security"
        },
        {
          name: "payouts",
          title: "Payouts"
        },
        {
          name: "payments",
          title: "Payments"
        },
        {
          name: "referrals",
          title: "Referrals"
        },
        {
          name: "notifications",
          title: "Notifications"
        }
      ];
    }
  },

  methods: {
    isActive(name) {
      const currentPage = this.$route.name;
      const pageName = "settings-" + name;

      if (pageName === currentPage) {
        return true;
      } else if (
        pageName === "settings-profile" &&
        currentPage === "settings"
      ) {
        return true;
      }
      return false;
    },
    navClass(name) {
      if (this.isActive(name)) {
        return { active: true };
      } else {
        return {};
      }
    }
  }
};
</script>
