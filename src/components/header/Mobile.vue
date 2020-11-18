<template>
  <nav class="header-nav hidden-desktop" v-if="$mq === 'mobile' && user">
    <a
      v-if="$route.meta.home"
      class="menu-item-home header-nav__item active"
      @click="goToHomePage"
      ><span>Home</span></a
    >
    <router-link v-else class="menu-item-home header-nav__item" to="/" exact
      ><span>Home</span></router-link
    >

    <router-link
      class="menu-item-explore header-nav__item"
      :class="{
        disabled: routeIsLoading('Explore')
      }"
      to="/explore"
      ><span>Explore</span></router-link
    >

    <router-link
      to="/notifications"
      class="menu-item-notifications header-nav__item hidden-desktop"
      :class="{
        unread: user && user.hasNotifications
      }"
      @click.prevent="goToModalRoute('/notifications')"
      ><span>Notifications</span></router-link
    >
    <router-link
      class="menu-item-messages header-nav__item showChat hidden-mobile"
      to="/chat"
      :class="{
        unread: user.hasMessages,
        active: !!$route.meta.chat
      }"
      ><span>Messages</span></router-link
    >
    <router-link
      class="menu-item-messages header-nav__item hidden-desktop"
      to="/chat"
      :class="{
        unread: user.hasMessages,
        active: !!$route.meta.chat
      }"
      v-if="$mq === 'mobile' && user"
    >
      <span>Messages</span>
    </router-link>
  </nav>
</template>

<script>
import ModalRouterGoto from "@/mixins/modalRouter/goto";

export default {
  name: "MobileHeader",

  mixins: [ModalRouterGoto],

  props: {
    activeName: {
      default: null,
      type: String
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    noAuthHeader() {
      return this.$route.meta && this.$route.meta.noAuthHeader;
    }
  },
  methods: {
    goToHomePage(e) {
      if (this.$route.meta.home) {
        e.preventDefault();
        this.$root.$emit("homePageReload");
      }
    },
    routeIsLoading(name) {
      return this.$store.state.route.loadingName === name;
    }
  },
  beforeDestroy() {
    if (this.activeName === "chat") {
      this.$store.commit("chat/setChatsFilter", "all");
    }
  }
};
</script>
