<template>
  <nav class="header-nav hidden-mobile">
    <template v-if="!noAuthHeader">
      <router-link class="menu-item-home header-nav__item" to="/" exact><span>Home</span></router-link>
      <router-link class="menu-item-explore header-nav__item" to="/explore"><span>Explore</span></router-link>

      <a
        v-if="user"
        href="/notifications"
        class="menu-item-notifications header-nav__item hidden-mobile btn-notifications"
        :class="{unread: user.hasNotifications}"
        @click.prevent="goToModalRoute('/notifications')"
      ><span>Notifications</span></a>
      <router-link class="menu-item-notifications header-nav__item hidden-desktop" to="/notifications"><span>Notifications</span>
      </router-link>

      <a
        v-if="user"
        href="/chat"
        class="menu-item-messages header-nav__item hidden-mobile btn-notifications"
        @click.prevent="goToChat"
      ><span>Messages</span></a>
      <router-link class="menu-item-messages header-nav__item hidden-desktop" to="/chat"><span>Messages</span></router-link>
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
  },
  methods: {
    goToChat() {
      if (this.$route.meta.chat) {
        this.$router.push("/chat");
      } else {
        this.goToModalRoute("/chat");
      }
    }
  }
};
</script>
