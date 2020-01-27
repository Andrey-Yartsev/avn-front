<template>
  <nav class="header-nav hidden-mobile" v-if="$mq === 'desktop'">
    <template v-if="!noAuthHeader">
      <template v-if="user">
        <a
          v-if="$route.meta.home"
          class="menu-item-home header-nav__item active"
          href="/"
          :class="{
            'router-link-exact-active active': isModalOnHomePage
          }"
          @click.prevent="goToHomePage"
        >
          <span>Home</span>
        </a>
        <router-link
          v-else
          class="menu-item-home header-nav__item"
          :class="{ 'router-link-exact-active active': isModalOnHomePage }"
          to="/"
          exact
        >
          <span>Home</span>
        </router-link>
      </template>
      <router-link
        class="menu-item-explore header-nav__item"
        :class="{
          disabled: routeIsLoading('Explore')
        }"
        to="/explore"
      >
        <span>Explore</span>
      </router-link>
      <a
        v-if="user"
        href="/notifications"
        class="menu-item-notifications header-nav__item hidden-mobile btn-notifications"
        :class="{
          unread: user && user.hasNotifications,
          active: !!$route.meta.notifications
        }"
        @click.prevent="goToNotifications"
        ><span>Notifications</span></a
      >
      <router-link
        class="menu-item-notifications header-nav__item hidden-desktop"
        to="/notifications"
        v-if="$mq === 'mobile'"
        ><span>Notifications</span>
      </router-link>

      <a
        v-if="user"
        href="/chat"
        class="menu-item-messages header-nav__item hidden-mobile btn-notifications"
        @click.prevent="goToChat"
        :class="{ unread: user.hasMessages, active: !!$route.meta.chat }"
        ><span>Messages</span></a
      >
      <router-link
        class="menu-item-messages header-nav__item hidden-desktop"
        to="/chat"
        v-if="$mq === 'mobile'"
        ><span>Messages</span></router-link
      >
    </template>
  </nav>
</template>

<script>
import ModalRouterGoto from "@/mixins/modalRouter/goto";

export default {
  name: "HeaderDesktop",

  data() {
    return {
      isModalOnHomePage: false
    };
  },

  mixins: [ModalRouterGoto],

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
    goToChat() {
      if (this.$route.meta.chat) {
        this.$router.push("/chat");
      } else {
        this.goToModalRoute("/chat");
      }
    },
    goToNotifications() {
      if (this.$route.meta.notifications) {
        this.$router.push("/notifications");
      } else {
        this.goToModalRoute("/notifications");
      }
    },
    routeIsLoading(name) {
      return this.$store.state.route.loadingName === name;
    }
  },
  watch: {
    ["$route"](route) {
      this.isModalOnHomePage = route.path === "/" && route.hash !== "";
    }
  }
};
</script>
