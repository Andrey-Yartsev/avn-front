<template>
  <header id="site_header" class="main-header">
    <div class="header-wrapper">
      <div class="container header_container guest">
        <nav class="header-nav hidden-mobile"></nav>
        <component :is="logo" class="header-logo" />
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
<template>
  <div :class="mainClass">
    <div class="login-wrapper">
      <div class="login-caption-col">
        <div class="login-caption">
          <component :is="logo" />
          <p class="promotion">
            Coming together.
          </p>
        </div>
        <Footer v-if="$mq === 'desktop'" />
      </div>
      <div class="login-form-col auth-block">
        <slot name="content" />
        <Footer v-if="$mq === 'mobile'" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ForgetHeader",
  computed: {
    logo() {
      return "rl-logo";
    }
  }
};
</script>
