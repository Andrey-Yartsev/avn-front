<template>
  <div class="aside-col aside-col_sticky">
    <div class="settings-aside">
      <div
        id="avatarBgAside"
        class="rounded-container white-bg-block loadWrap"
        :class="{'hidden-mobile': !showAvatarBlock, loaderWrap: loading}"
      >
        <div class="settings-profile-images">
          <div class="bg">
            <template v-if="!bgRemoved">
              <img v-if="bgPreview" :src="bgPreview" />
              <img v-else-if="user.header" :src="user.header" />
            </template>
          </div>

          <div class="avatar-block">
            <span class="avatar">
              <img v-if="avatarPreview" :src="avatarPreview" />
              <img v-else-if="user.avatar" :src="user.avatar" />
            </span>
            <label for="avatar" class="select-user-image"></label>
            <input
              type="file"
              id="avatar"
              ref="avatar"
              accept=".jpg,.jpeg,.gif,.png"
              @change="setAvatarPreview"
            >
            <span
              class="reset-user-image reset-avatar"
              @click="removeAvatar"
            ></span>
          </div>

          <span
            v-show="showBgAdd"
            class="reset-user-image reset-bg"
            @click="removeBg"
          ></span>
          <label
            for="bg" class="select-user-image"
            v-show="showBgAdd"
          >
            <span class="select-user-image__text">
              Add background picture
            </span>
          </label>
          <input
            type="file"
            id="bg"
            ref="bg"
            accept=".jpg,.jpeg,.gif,.png"
            @change="setBgPreview"
          >
        </div>
        <div class="profile-identifier">
          <div class="profile-name profile-name-settings">
            <div class="profile-name__main">
              <span class="name">{{ user.name }}</span>
              <span class="verified-user" v-if="user.isVerified"></span>
            </div>
            <span class="user-login"><a :href="'/' + user.username">{{ user.username }}</a></span>
          </div>

          <div class="profile-picture-btns" :class="{show: showSave}">
            <button
              class="btn-cancel-changes cancel-changes"
              @click="resetBgPreview"
            ></button>
            <button
              class="btn save-changes"
              @click="save"
            >Save changes</button>
          </div>

        </div>

        <div class="lds-dual-ring with-text not-fullscreen" v-if="loading">
          <div class="loader-text lowered">Loading</div>
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
import ProfileBg from "@/mixins/profileBg";
import Avatar from "@/mixins/avatar";

export default {
  name: "SettingsAside",

  mixins: [Mobile, ProfileBg, Avatar],

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
    },
    showAvatarSave() {
      return this.avatarPreview && !this.avatarUploading;
    },
    showSave() {
      return this.showAvatarSave || this.showBgSave;
    },
    loading() {
      return this.bgUploading || this.avatarUploading;
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
    },
    async save() {
      if (this.$refs.bg.files.length) {
        await this.saveBg();
      }
      if (this.$refs.avatar.files.length) {
        await this.saveAvatar();
      }
    }
  }
};
</script>
