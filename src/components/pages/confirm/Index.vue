<template>
  <div class="error404View error404 flex">
    <div class="container">
      <template v-if="pageType === 'password'">
        <h3 class="error404__title ">
          This link for password resetting has already been used
        </h3>
        <p>
          Please, make sure that you don't try to use the same link to reset
          your password several times
        </p>
        <router-link class="resetPasswordLink" to="/forgot">
          Reset password one more time
        </router-link>
      </template>
      <template v-if="pageType === 'email'">
        <h3 class="error404__title ">
          Email confirmation error
        </h3>
      </template>
      <router-link class="btn btn_fix-width-ex-lg lg alt" to="/">
        Go back to {{ host }}
      </router-link>
    </div>
    <Footer class="site-footer_main" />
  </div>
</template>

<script>
import Footer from "@/components/footer/Index";

export default {
  components: {
    Footer
  },
  computed: {
    pageType() {
      return this.$route.meta.confirmType;
    },
    host() {
      return window.location.hostname;
    }
  }
};
</script>
