<template>
  <div class="error404View error404">
    <div class="container">
      <img
        :src="process.env.VUE_APP_CDN_PATH + 'static/img/404-image.svg'"
        alt=""
        class="error404__img"
      />
      <h3 class="error404__title">Page is not found</h3>
      <p class="error404__text">
        The link you followed may be broken, or the page may have been removed.
      </p>
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
    host() {
      return window.location.hostname;
    }
  }
};
</script>
