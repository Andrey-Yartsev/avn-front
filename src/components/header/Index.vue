<template>
  <header
    ref="siteHeader"
    id="site_header"
    :class="{ guest: !user }"
    class="main-header main-header_top"
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
        <Logo
          class="header-logo header-logo_size"
          :class="{ 'header-logo_center': $route.name === 'NotFound' }"
        />
        <template v-if="notFound">
          <User />
          <button
            class="btn make-post-btn make-post-btn_header hidden-mobile"
            type="button"
            @click="openAddPostModal"
            v-if="user"
            :disabled="disabledButton"
          >
            <span class="icn-item icn-post icn-size_lg"></span>
            Share
          </button>
          <router-link
            to="/addPost"
            class="make-post-btn make-post-btn_header hidden-desktop"
            :class="{
              btn: $mq === 'desktop',
              'icn-item icn-post icn-size_lg': $mq === 'mobile'
            }"
            v-if="user"
          >
            <template v-if="$mq === 'desktop'">
              <span class="icn-item icn-post icn-size_lg"></span>
              Share
            </template>
          </router-link>
          <template v-if="authSection">
            <div class="btns-login-user">
              <router-link to="/register" class="btn border register"
                >Sign up</router-link
              >
              <router-link to="/login" class="btn border alt login icn-item"
                >Log in</router-link
              >
            </div>
          </template>
        </template>
        <template v-else>
          <template
            v-if="!noAuthHeader && !authSection && !noAuthSectionForGuest"
          >
            <Search />
            <GenderFilter v-if="showGenderFilter" />
            <User />
            <button
              class="btn make-post-btn make-post-btn_header hidden-mobile"
              type="button"
              @click="openAddPostModal"
              :disabled="disabledButton"
              v-if="$mq === 'desktop'"
            >
              <span class="icn-item icn-post icn-size_lg"></span>
              Share
            </button>
            <!-- <router-link
              to="/addPost"
              class="make-post-btn make-post-btn_header hidden-desktop icn-item icn-post icn-size_lg"
              v-if="$mq === 'mobile'"
            /> -->
          </template>
          <template v-if="authSection">
            <Search />
            <div class="btns-login-user">
              <GenderFilter v-if="showGenderFilter" />
              <a
                href="/register"
                @click.prevent="openSingupModal"
                class="btn border register"
                >Sign Up {{ noAuthSection }}</a
              >
              <a
                href="/login"
                class="btn border alt login hidden-desktop"
                v-if="$mq === 'mobile'"
                @click.prevent="openLoginModal"
                >Log in</a
              >
              <div
                :class="['auth-header-block hidden-mobile', { show: true }]"
                v-click-outside="hide"
                v-if="$mq === 'desktop'"
              >
                <div
                  class="btn login login_colored icn-item"
                  @click="show"
                  :class="{ 'btn_drop-arrow': $mq === 'desktop' }"
                >
                  Log in
                </div>
                <div class="auth-block-dropdown" v-if="opened">
                  <div class="auth-block-dropdown__inside">
                    <Logo class="auth-logo header-logo_size" />
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
                    <Footer class="site-footer_main" />
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
import Footer from "@/components/footer/Index.vue";
import GenderFilter from "@/components/common/GenderFilter";
import Logo from "@/components/common/Logo";

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
    SignupForm,
    Footer,
    GenderFilter,
    Logo
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    noAuthHeader() {
      return this.$route.meta && this.$route.meta.noAuthHeader;
    },
    noAuthSection() {
      return this.$route.meta && this.$route.meta.noAuthSection;
    },
    noAuthSectionForGuest() {
      return this.noAuthSection && !this.user;
    },
    authSection() {
      if (this.noAuthSection) {
        return false;
      }
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
    disabledButton() {
      return this.$route.meta.disabledAddPostButton;
    },
    showGenderFilter() {
      if (this.$route.meta && this.$route.meta.notShowGenderFilter) {
        return false;
      }
      return (
        this.$route.meta.cssName !== "staticPage" &&
        this.$route.meta.cssName !== "support"
      );
    }
  },
  methods: {
    openAddPostModal() {
      if (this.disabledAddPostButton) return;
      this.$store.dispatch("modal/show", {
        name: "addPost"
      });
    },
    openLoginModal() {
      this.$store.dispatch("modal/show", {
        name: "login"
      });
    },
    openSingupModal() {
      this.$store.dispatch("modal/show", {
        name: "signup"
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
