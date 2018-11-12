<template>
  <nav class="header-nav hidden-desktop">
    <router-link class="menu-item-home header-nav__item" to="/" exact><span>Home</span></router-link>
    <router-link class="menu-item-explore header-nav__item" to="/explore"><span>Explore</span></router-link>
    <router-link
      to="/notifications"
      class="menu-item-notifications header-nav__item hidden-desktop"
      :class="{unread: user.hasNotifications}"
      @click.prevent="goToModalRoute('/notifications')"
    ><span>Notifications</span></router-link>
    <router-link class="menu-item-messages header-nav__item showChat hidden-mobile" to="/chat"><span>Messages</span></router-link>
    <router-link class="menu-item-messages header-nav__item hidden-desktop" to="/chat"><span>Messages</span></router-link>
  </nav>
</template>

<script>
import ModalRouter from "@/mixins/modalRouter";

export default {
  name: "MobileHeader",

  mixins: [ModalRouter],

  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    noAuthHeader() {
      return this.$route.meta && this.$route.meta.noAuthHeader;
    }
  }
};
</script>
