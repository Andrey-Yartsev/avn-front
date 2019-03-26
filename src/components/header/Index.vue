<template>
  <header
    ref="siteHeader"
    id="site_header"
    :class="{ guest: noAuthHeader }"
    class="main-header"
    :style="{
      right: `${-scrollBarWidth}px`
    }"
  >
    <div
      class="header-wrapper"
      :style="{ 'padding-right': `${scrollBarWidth}px` }"
    >
      <div :class="['container', 'header_container']">
        <DesktopHeader v-if="!notFound && $mq === 'desktop'" />
        <component :is="logo" class="header-logo" />
        <template v-if="notFound">
          <User />
          <button
            class="btn make-post-btn make-post-btn_header btn-with-icon_st hidden-mobile"
            type="button"
            @click="openAddPostModal"
            v-if="user"
            :disabled="disabledButton"
          >
            Share
          </button>
          <router-link
            to="/addPost"
            class="btn make-post-btn make-post-btn_header btn-with-icon_st hidden-desktop"
            v-if="user"
          >
            Share
          </router-link>
          <template v-if="authSection">
            <div class="btns-login-user">
              <router-link to="/register" class="register"
                >Have an account?</router-link
              >
              <router-link to="/login" class="btn border alt login"
                >Log in</router-link
              >
            </div>
          </template>
        </template>
        <template v-else>
          <template v-if="!noAuthHeader && !authSection">
            <Search />
            <User />
            <button
              class="btn make-post-btn make-post-btn_header btn-with-icon_st hidden-mobile"
              type="button"
              @click="openAddPostModal"
              :disabled="disabledButton"
            >
              Share
            </button>
            <router-link
              to="/addPost"
              class="btn make-post-btn make-post-btn_header btn-with-icon_st hidden-desktop"
            >
              Share
            </router-link>
          </template>
          <template v-if="authSection">
            <div class="btns-login-user">
              <router-link to="/register" class="register"
                >Have an account?</router-link
              >
              <router-link
                to="/login"
                class="btn border alt login hidden-desktop"
                v-if="$mq === 'mobile'"
                >Log in</router-link
              >
              <div
                :class="['auth-header-block hidden-mobile', { show: opened }]"
                v-click-outside="hide"
              >
                <div class="btn border alt login" @click="show">Log in</div>
                <div class="auth-block-dropdown">
                  <div class="auth-block-dropdown__inside">
                    <SignupForm type="dropdown" v-if="showSignup" />
                    <LoginForm
                      v-else
                      @goToForgot="
                        () => {
                          opened = false;
                        }
                      "
                      type="dropdown"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import Search from "../pages/search/bubble/Index";
import User from "./User";
import ModalRouterGoto from "@/mixins/modalRouter/goto";
import StickyHeader from "@/mixins/stickyHeader";
import DesktopHeader from "./Desktop";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ClickOutside from "vue-click-outside";

export default {
  name: "Header",
  data() {
    return {
      email: "",
      password: "",
      opened: false
    };
  },
  mixins: [ModalRouterGoto, StickyHeader],
  components: {
    Search,
    User,
    DesktopHeader,
    LoginForm,
    SignupForm
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    noAuthHeader() {
      return this.$route.meta && this.$route.meta.noAuthHeader;
    },
    authSection() {
      if (!this.user) {
        return true;
      }
      return this.$route.meta && this.$route.meta.authSection;
    },
    scrollBarWidth() {
      if (!this.$store.state.global.modalOpened) {
        return 0;
      }
      return this.$store.state.global.scrollBarWidth;
    },
    notFound() {
      if (!this.$route.meta.profile) {
        return false;
      }
      return !!this.$store.state.profile.home.fetchProfileError;
    },
    showSignup() {
      return this.$store.state.common.headerSignup;
    },
    logo() {
      return "rl-logo";
    },
    disabledButton() {
      return this.$route.meta.disabledAddPostButton;
    }
  },
  methods: {
    openAddPostModal() {
      if (this.disabledAddPostButton) return;
      this.$store.dispatch("modal/show", {
        name: "addPost"
      });
    },
    show() {
      this.opened = true;
    },
    hide() {
      this.opened = false;
    }
  },
  directives: {
    ClickOutside
  }
};
</script>
