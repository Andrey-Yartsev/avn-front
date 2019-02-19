<template>
  <header ref="siteHeader" id="site_header" :class="{ guest: noAuthHeader }">
    <div class="header-wrapper">
      <div
        :class="['container', 'header_container']"
        v-bind:style="{ right: scrollBarWidth + 'px' }"
      >
        <DesktopHeader v-if="!notFound && $mq === 'desktop'" />
        <component :is="logo" class="header-logo" />
        <template v-if="notFound">
          <User />
          <button
            class="btn make-post-btn hidden-mobile"
            type="button"
            @click="openAddPostModal"
            v-if="user"
          >
            Share
          </button>
          <router-link
            to="/addPost"
            class="btn make-post-btn hidden-desktop"
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
              class="btn make-post-btn hidden-mobile"
              type="button"
              @click="openAddPostModal"
            >
              Share
            </button>
            <router-link to="/addPost" class="btn make-post-btn hidden-desktop">
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
      opened: false,
      lastScrollTop: 0
    };
  },
  mixins: [ModalRouterGoto],
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
    }
  },
  methods: {
    onScroll() {
      const { scrollTop } = document.documentElement;
      const { pageYOffset } = window;
      const { height } = this.$refs.siteHeader.getBoundingClientRect();
      const st = pageYOffset || scrollTop;

      if (st > this.lastScrollTop) {
        if (st > height) {
          document.body.classList.add("scroll-top");
        }
        document.body.classList.remove("scroll-bottom");
      } else {
        document.body.classList.remove("scroll-top");
        if (st >= height) {
          document.body.classList.add("scroll-bottom");
        } else {
          document.body.classList.remove("scroll-bottom");
        }
      }
      this.lastScrollTop = st <= 0 ? 0 : st;
    },
    openAddPostModal() {
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
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  }
};
</script>
