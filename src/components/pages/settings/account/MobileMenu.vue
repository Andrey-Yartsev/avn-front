<template>
  <div class="hidden-desktop">
    <div class="form-title">
      <div class="inner">
        <span class="semi-transparent">Login</span>
      </div>
    </div>
    <div class="shadow-block no-padding">
      <div class="settings-nav">
        <router-link to="/settings/account/email" class="warning">
          <span>Email</span>
          <span class="value">{{ user.email }}</span></router-link>
        <router-link to="/settings/account/twitter">
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
        <router-link to="/settings/account/password" class=""><span>Change or reset your password</span></router-link>
      </div>
    </div>
    <div class="form-title">
      <div class="inner">
        <span class="semi-transparent">Manage Account</span>
      </div>
    </div>
    <div class="shadow-block no-padding">
      <div class="settings-nav">
        <router-link to="/settings/account/manage">
          <span class="user-login">{{ user.name }}</span>
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
