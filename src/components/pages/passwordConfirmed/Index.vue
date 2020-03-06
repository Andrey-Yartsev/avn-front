<template>
  <div class="error404View error404 flex">
    <div class="container">
      <h3 class="error404__title ">
        This link for password resetting has already been used
      </h3>
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

<style lang="scss" scoped>
.error404View.error404.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  .container {
    display: flex;
    flex-grow: 1;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
  }
}
</style>
