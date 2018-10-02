<template>
  <header id="site_header" v-if="show">
    <div class="header-wrapper">
      <div :class="['container', 'header_container', {guest: noAuthHeader}]">
        <nav class="header-nav hidden-mobile">
          <template v-if="!noAuthHeader">
            <router-link class="menu-item-home" to="/" exact><span>Home</span></router-link>
            <router-link class="menu-item-explore" to="/explore"><span>Explore</span></router-link>
            <router-link class="menu-item-notifications hidden-mobile btn-notifications" to="/notifications"><span>Notifications</span>
            </router-link>
            <router-link class="menu-item-notifications hidden-desktop" to="/notifications"><span>Notifications</span>
            </router-link>
            <router-link class="menu-item-messages showChat hidden-mobile" to="/chat"><span>Messages</span>
            </router-link>
            <router-link class="menu-item-messages hidden-desktop" to="/chat"><span>Messages</span></router-link>
          </template>
        </nav>
        <h1 class="header-logo">
          <router-link to="/">
            <img src="https://team2.retloko.com/ver_6667c0c/design/img/logo-full.svg">
            <img class="white-logo" src="https://team2.retloko.com/ver_6667c0c/design/img/logo-full-white.svg">
          </router-link>
        </h1>
        <template v-if="!noAuthHeader">
          <Search/>
          <User/>
          <button class="btn make-post-btn hidden-mobile" type="button">Share</button>
          <router-link class="btn make-post-btn hidden-desktop" to="/addPost">Share</router-link>
        </template>
        <template v-else>
          <router-link to="/register" class="btn border register">Sign up</router-link>
          <router-link to="/login" class="btn border alt login">Log in</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import Search from "./Search";
import User from "./User";

export default {
  name: "Header",
  components: {
    Search,
    User
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    noAuthHeader() {
      return this.$route.meta && this.$route.meta.noAuthHeader;
    },
    show() {
      return this.noAuthHeader || this.user;
    }
  }
};
</script>
