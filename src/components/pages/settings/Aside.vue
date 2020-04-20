<template>
  <div class="aside-col aside-col_sticky">
    <div class="settings-aside">
      <div
        id="avatarBgAside"
        class="rounded-container white-bg-block"
        :class="{ 'hidden-mobile': !showAvatarBlock, 'loader-wrap': loading }"
      >
        <div class="settings-profile-images">
          <div
            class="bg-profile bg-profile_height bg-profile_height-sm bg-color bg-gradient_light"
          >
            <template v-if="!bgRemoved">
              <img v-if="bgPreview" :src="bgPreview" class="f1" />
              <img v-else-if="user.header" :src="user.header" class="f2" />
            </template>
            <label
              for="bg"
              class="select-user-image select-user-image_cover select-user-image_cover-sm"
              :class="{ 'single-btn': !user.header }"
              v-show="!hideBgAdd"
            >
              <span class="select-user-image__text" v-if="!user.header">
                Add background picture
              </span>
              <span
                class="icn-item icn-media"
                :class="{
                  'icn-size_lg': $mq === 'mobile',
                  'icn-size_md': $mq === 'desktop'
                }"
              />
            </label>
            <span
              v-if="!bgRemoved && user.header"
              v-show="!hideBgAdd"
              class="reset-user-image reset-bg icn-item btn-reset icn-pos_center"
              :class="{ 'icn-size_lg': $mq === 'mobile' }"
              @click="showBgConfirm"
            />
            <input
              type="file"
              id="bg"
              ref="bgAside"
              accept=".jpg,.jpeg,.gif,.png"
              @change="setBgPreview"
            />
            <span
              class="loader-container loader-container_center"
              v-if="gettingBgPreview"
            >
              <Loader
                :fullscreen="false"
                :inline="true"
                text=""
                :small="true"
              />
            </span>
          </div>

          <div class="avatar-block">
            <span class="avatar">
              <span class="avatar__img">
                <img v-if="avatarPreview" :src="avatarPreview" />
                <img v-else-if="user.avatar" :src="user.avatar" />
              </span>
              <span
                class="loader-container loader-container_center"
                v-if="gettingPreview"
              >
                <Loader
                  :fullscreen="false"
                  :inline="true"
                  text=""
                  class="small"
                />
              </span>
            </span>
            <template v-show="!gettingPreview">
              <label
                for="avatar"
                class="select-user-image select-user-image_avatar"
                :class="{ 'single-btn': !user.avatar }"
                ><span
                  class="icn-media icn-item"
                  :class="{ 'icn-size_lg': $mq === 'mobile' }"
                />
              </label>
              <input
                type="file"
                id="avatar"
                ref="avatar"
                accept=".jpg,.jpeg,.gif,.png"
                @change="setAvatarPreview"
              />
              <span
                v-if="user.avatar"
                class="reset-user-image reset-avatar icn-item btn-reset icn-pos_center"
                :class="{ 'icn-size_lg': $mq === 'mobile' }"
                @click="showAvatarConfirm"
              ></span>
            </template>
          </div>
        </div>
        <div class="profile-identifier">
          <div
            class="profile-name profile-name-settings hidden-mobile"
            v-if="$mq === 'desktop'"
          >
            <div class="profile-name__main">
              <span class="name">{{ user.name }}</span>
              <span
                class="verified-user icn-item"
                v-if="user.isVerified"
              ></span>
            </div>
            <span class="user-login reset-ml"
              ><a :href="'/' + user.username">{{ user.username }}</a></span
            >
          </div>

          <div class="profile-picture-btns" :class="{ show: showSave }">
            <button
              class="btn-cancel-changes cancel-changes icn-item icn-size_lg"
              @click="reset"
            ></button>
            <button class="btn save-changes" @click="save">Save changes</button>
          </div>
        </div>

        <div
          class="loader-container loader-container_center loader-container_top-level"
          v-if="loading"
        >
          <Loader :fullscreen="false" text="" :semidark="true" />
        </div>
      </div>
      <perfect-scrollbar
        class="rounded-container settings-scroll-wrapper"
        :class="{ 'hidden-mobile': !isHome }"
        ref="menu"
      >
        <div class="form-title hidden-desktop" v-if="$mq === 'mobile'">
          <div class="inner">
            <span class="semi-transparent">
              <router-link :to="'/' + user.username" class="link-profile">
                {{ user.name }}
              </router-link>
            </span>
          </div>
        </div>
        <div class="shadow-block no-padding">
          <div class="settings-nav">
            <router-link
              :to="v.path || '/settings/' + v.name"
              :class="navClass(v.name)"
              v-for="v in navigation"
              v-bind:key="v.name"
              class="settings-nav__item settings-nav__item_arr"
              :id="'menu-' + v.name"
            >
              <span>{{ v.title }}</span>
            </router-link>
          </div>
        </div>
      </perfect-scrollbar>

      <Footer class="site-footer_sidebar" v-if="isHome || $mq === 'desktop'" />
    </div>
  </div>
</template>

<script>
import Mobile from "./mobile";
import Footer from "@/components/footer/Index";
import ProfileBg from "@/mixins/profileBg";
import Avatar from "@/mixins/avatar";
import Loader from "@/components/common/Loader";

export default {
  name: "SettingsAside",

  mixins: [Mobile, ProfileBg, Avatar],

  components: {
    Footer,
    Loader
  },

  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    showAvatarBlock() {
      return this.$route.name === "SettingsProfile";
    },
    navigation() {
      const items = [
        {
          name: "profile",
          title: "Edit Profile"
        },
        {
          name: "account",
          title: "Account"
        }
      ];

      items.push(
        ...[
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
            name: "premium-links",
            title: "Premium Links"
          },
          {
            name: "products",
            title: "My purchases"
          },
          {
            name: "payouts",
            title: "Payouts"
          },
          {
            name: "payments",
            title: "Payments"
          }
        ]
      );
      if (this.user && this.user.canEarn) {
        items.push(
          {
            name: "subscribers",
            title: "Subscribers"
          },
          {
            name: "earnings",
            title: "Earnings"
          }
        );
      }
      if (process.env.VUE_APP_NAME === "avn") {
        items.push({
          name: "credits",
          title: "Credits"
        });
      }
      items.push({
        name: "referrals",
        title: "Referrals"
      });
      items.push({
        name: "notifications",
        title: "Notifications"
      });
      if (this.$store.state.auth.user.subscribePrice > 0) {
        items.push({
          name: "trials",
          title: "Free Trials"
        });
      }
      items.push({
        name: "obs",
        title: "OBS"
      });
      if (this.user && this.user.isMakePayment) {
        items.push({
          name: "magazine",
          title: "AVN Magazine"
        });
      }
      return items;
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
      if (this.$refs.bgAside.files.length) {
        await this.saveBg({ isClear: true, refName: "bgAside" });
      }
      if (this.$refs.avatar.files.length) {
        await this.saveAvatar();
      }
    },
    resetAvatarPreview() {
      this.avatarPreview = "";
      this.$refs.avatar.value = "";
    },
    reset() {
      this.resetAvatarPreview();
      this.resetBgPreview();
    },
    showAvatarConfirm() {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "Remove avatar",
          success: this.removeAvatar
        }
      });
    },
    showBgConfirm() {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "Remove background image",
          success: this.removeBg
        }
      });
    }
  },

  mounted() {
    const m = this.$route.path.match(new RegExp("/settings/([^/]+).*"));
    if (m) {
      const name = m[1];
      const el = document.getElementById("menu-" + name);
      if (el) {
        this.$refs.menu.$el.scrollTop = el.offsetTop;
      }
    }
  }
};
</script>
