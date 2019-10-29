<template>
  <header id="site_header" class="main-header main-header_top">
    <div class="header-wrapper">
      <div class="container header_container guest">
        <nav class="header-nav hidden-mobile"></nav>
        <Logo class="header-logo header-logo_size" />
        <router-link to="/register" class="btn border register"
          >Sign up</router-link
        >
        <router-link href="/login" class="btn border alt login"
          >Log in</router-link
        >
      </div>
    </div>
  </header>
</template>

<script>
import Logo from "@/components/common/Logo";

export default {
  name: "ForgetHeader",
  components: {
    Logo
  }
};
</script>
