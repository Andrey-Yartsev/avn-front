<template>
  <div class="hidden-desktop">
    <div class="form-title">
      <div class="inner">
        <span class="semi-transparent">Login</span>
      </div>
    </div>
    <div class="shadow-block no-padding">
      <div class="settings-nav">
        <router-link
          to="/settings/account/email"
          class="settings-nav__item settings-nav__item_arr field-invalid"
        >
          <span>Email</span>
          <span class="value user-email">{{
            user.emailNew || user.email
          }}</span></router-link
        >
        <router-link
          to="/settings/account/twitter"
          class="settings-nav__item settings-nav__item_arr"
        >
          <span>Twitter</span>
          <span class="value">Connect</span>
        </router-link>
      </div>
    </div>
    <div class="form-title">
      <div class="inner">
        <span class="semi-transparent">Password</span>
      </div>
    </div>
    <div class="shadow-block no-padding">
      <div class="settings-nav">
        <router-link
          to="/settings/account/password"
          class="settings-nav__item settings-nav__item_arr"
          ><span>Change or reset your password</span></router-link
        >
      </div>
    </div>
    <div class="form-title">
      <div class="inner">
        <span class="semi-transparent">Manage Account</span>
      </div>
    </div>
    <div class="shadow-block no-padding">
      <div class="settings-nav">
        <router-link
          to="/settings/account/manage"
          class="settings-nav__item settings-nav__item_arr"
        >
          <span class="user-login reset-ml">{{ user.name }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsAccountMobileMenu",

  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  }
};
</script>
