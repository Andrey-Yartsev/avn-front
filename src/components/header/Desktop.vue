<template>
  <nav class="header-nav hidden-mobile">
    <template v-if="!noAuthHeader">
      <router-link class="menu-item-home" to="/" exact><span>Home</span></router-link>
      <router-link class="menu-item-explore" to="/explore"><span>Explore</span></router-link>
      <a
        href="/notifications"
        class="menu-item-notifications hidden-mobile btn-notifications"
        :class="{unread: user.hasNotifications}"
        @click.prevent="goToModalRoute('/notifications')"
      ><span>Notifications</span></a>
      <router-link class="menu-item-notifications hidden-desktop" to="/notifications"><span>Notifications</span>
      </router-link>
      <router-link class="menu-item-messages showChat hidden-mobile" to="/chat"><span>Messages</span>
      </router-link>
      <router-link class="menu-item-messages hidden-desktop" to="/chat"><span>Messages</span></router-link>
    </template>
  </nav>
</template>

<script>
import ModalRouter from "@/mixins/modalRouter";

export default {
  name: "HeaderDesktop",

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
