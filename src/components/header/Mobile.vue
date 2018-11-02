<template>
  <nav class="header-nav hidden-desktop">
    <router-link class="menu-item-home" to="/"><span>Home</span></router-link>
    <router-link class="menu-item-explore" to="/explore"><span>Explore</span></router-link>
    <a
      href="/notifications"
      class="menu-item-notifications hidden-desktop"
      :class="{unread: user.hasNotifications}"
      @click.prevent="goToModalRoute('/notifications')"
    ><span>Notifications</span></a>
    <router-link class="menu-item-messages showChat hidden-mobile" to="/chat"><span>Messages</span></router-link>
    <router-link class="menu-item-messages hidden-desktop" to="/chat"><span>Messages</span></router-link>
  </nav>
</template>

<script>
export default {
  name: "HeaderMobile",

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
