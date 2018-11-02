<template>
  <header id="site_header" v-if="show" :class="{guest: noAuthHeader}">
    <div class="header-wrapper">
      <div :class="['container', 'header_container']">
        <DesktopHeader />
        <h1 class="header-logo">
          <router-link to="/">
            <img src="/static/img/logo-full.svg">
            <img class="white-logo" src="/static/img/logo-full-white.svg">
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
import ModalRouter from "@/mixins/modalRouter";
import DesktopHeader from "./Desktop";

export default {
  name: "Header",
  mixins: [ModalRouter],
  components: {
    Search,
    User,
    DesktopHeader
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
