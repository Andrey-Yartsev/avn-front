<template>
  <div class="sidebar" v-if="user">
    <div class="sidebar__wrap-close" v-if="$mq === 'mobile'">
      <span
        role="button"
        class="close icn-item user-menu-close hidden-desktop icn-size_lg"
        @click="hide"
      />
    </div>
    <perfect-scrollbar class="sidebar__scroller">
      <router-link
        :to="'/' + user.username"
        class="avatar header-avatar"
        v-if="$mq === 'mobile'"
      >
        <span class="avatar__img">
          <img v-if="user.avatar" :src="user.avatar" />
        </span>
      </router-link>
      <div class="sidebar__inside">
        <div class="sidebar__header">
          <div class="user-group-info">
            <div class="user-menu-name">
              <router-link :to="'/' + user.username" class="name">{{
                user.name
              }}</router-link>
              <span
                class="verified-user icn-item"
                v-if="user.isVerified"
              ></span>
            </div>
            <div class="user-menu-login user-login reset-ml">
              <router-link :to="'/' + user.username">{{
                user.username
              }}</router-link>
            </div>
          </div>
          <div class="user-menu-counts">
            <router-link to="/following" class="user-menu-counts-item">
              <span class="user-menu-counts-item-count" id="sidebarFollowing">{{
                user.followingCount
              }}</span
              >&nbsp;
              <span class="user-menu-counts-item-title">Following</span>
            </router-link>
            <router-link to="/followers" class="user-menu-counts-item">
              <span class="user-menu-counts-item-count" id="sidebarFollowers">{{
                user.followersCount
              }}</span
              >&nbsp;
              <span class="user-menu-counts-item-title">Followers</span>
            </router-link>
          </div>
        </div>
        <div class="sidebar-menu">
          <nav class="user-menu">
            <div class="user-menu__col">
              <router-link
                class="user-menu-item user-menu-item__profile icn-item"
                :to="'/' + user.username"
                >Profile</router-link
              >
              <router-link
                class="user-menu-item user-menu-item__statistics icn-item"
                to="/statistics"
                >Statistics</router-link
              >
              <router-link
                class="user-menu-item user-menu-item__payouts icn-item"
                to="/settings/payouts"
                >Payouts</router-link
              >
              <router-link
                class="user-menu-item user-menu-item__payments icn-item"
                to="/settings/payments"
                >Payments
              </router-link>
              <router-link
                v-if="user.canEarn"
                class="user-menu-item user-menu-item__subscribers icn-item"
                to="/settings/subscribers"
                >Subscribers
              </router-link>
            </div>
            <div class="user-menu__col">
              <router-link
                class="user-menu-item user-menu-item__privacy icn-item"
                to="/settings"
                >Settings and Privacy
              </router-link>
              <router-link
                class="user-menu-item user-menu-item__help icn-item"
                to="/contact"
                >Help</router-link
              >
              <router-link
                class="user-menu-item user-menu-item__logout icn-item"
                to="/logout"
                >Log out</router-link
              >
            </div>
          </nav>
          <div class="user-menu-bottom-btns">
            <span
              role="button"
              class="user-menu-bottom-btn user-menu-bottom-btn__skin-toggle"
              @click="toggleDarkTheme"
              ><span
                class="icn-theme icn-item"
                v-tooltip="'Change theme'"
              ></span
            ></span>
            <!-- QR temporary hidden -->
            <!--<span role="button" class="user-menu-bottom-btn user-menu-bottom-btn__qr"></span>-->
            <span
              role="button"
              :data-clipboard-text="'/' + user.username"
              :data-title="user.username"
              class="user-menu-bottom-btn user-menu-bottom-btn__share"
              @click="copyToClipboard"
              ><span class="icn-share icn-item" v-tooltip="'Copy link'"></span
            ></span>
          </div>
        </div>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    hide() {
      this.$store.dispatch("global/hideUserMobileBar");
      document.body.classList.remove("sidebar-shown", "disable-scroll-page");
    },
    copyToClipboard() {
      this.$copyText(window.location.origin + "/" + this.user.username).then(
        () => {
          this.$store.dispatch("global/flashToast", {
            text: "Profile link copied!"
          });
        }
      );
    },
    toggleDarkTheme() {
      this.$store.dispatch("global/toggleDarkTheme");
    }
  }
};
</script>
