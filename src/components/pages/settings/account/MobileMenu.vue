<template>
  <div class="hidden-desktop" v-if="$mq === 'mobile'">
    <div class="form-title">
      <div class="inner">
        <span class="semi-transparent">Login</span>
      </div>
    </div>
    <div class="shadow-block no-padding">
      <div class="settings-nav">
        <router-link
          to="/settings/account/email"
          class="settings-nav__item settings-nav__item_arr"
          :class="{
            'field-invalid ': !user.emailChecked
          }"
        >
          <span>Email</span>
          <span class="value user-email">{{ email }}</span>
        </router-link>
        <router-link
          to="/settings/account/twitter"
          class="settings-nav__item settings-nav__item_arr"
        >
          <span>Twitter</span>
          <span class="value">Connect</span>
        </router-link>
        <router-link
          to="/settings/account/google"
          class="settings-nav__item settings-nav__item_arr"
        >
          <span>Google</span>
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
          <span class="user-login user-login_st reset-ml">{{
            user.username
          }}</span>
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
    },
    email() {
      if (this.user.emailChecked) {
        return this.user.email;
      }
      return this.user.emailNew || this.user.email;
    }
  }
};
</script>
