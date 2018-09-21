<template>
  <div class="sidebar">
    <div class="sidebar__scroller">
      <router-link :to="'/' + user.username" class="avatar header-avatar"><img :src="user.avatar"/></router-link>
      <div class="sidebar__inside">
        <span role="button" class="user-menu-close"></span>
        <div class="sidebar__header">
          <div class="user-group-info">
            <div class="user-menu-name">
              <router-link :to="'/' + user.username" class="name">{{ user.name }}</router-link>
              <span class="verified-user"></span>
            </div>
            <div class="user-menu-login user-login">
              <router-link :to="'/' + user.username">{{ user.username }}</router-link>
            </div>
          </div>
          <div class="user-menu-counts">
            <router-link to="/following" class="user-menu-counts-item">
              <span class="user-menu-counts-item-count" id="sidebarFollowing">{{ user.followingCount }}</span>&nbsp;
              <span class="user-menu-counts-item-title">Following</span>
            </router-link>
            <router-link to="/followers" class="user-menu-counts-item">
              <span class="user-menu-counts-item-count" id="sidebarFollowers">{{ user.followersCount }}</span>&nbsp;
              <span class="user-menu-counts-item-title">Followers</span>
            </router-link>
          </div>
        </div>
        <div class="sidebar-menu">
          <nav class="user-menu">
            <div class="user-menu__col">
              <router-link class="user-menu-item user-menu-item__profile" :to="'/' + user.username">Profile</router-link>
              <!--
              <router-link class="user-menu-item user-menu-item__statistics" to="/statistics">Statistics</router-link>
              -->
              <router-link class="user-menu-item user-menu-item__payouts" to="/settings/payouts">Payouts</router-link>
              <router-link class="user-menu-item user-menu-item__payments" to="/settings/payments">Payments
              </router-link>
            </div>
            <div class="user-menu__col">
              <router-link class="user-menu-item user-menu-item__privacy" to="/settings">Settings and Privacy
              </router-link>
              <router-link class="user-menu-item user-menu-item__help" to="/contact">Help</router-link>
              <router-link class="user-menu-item user-menu-item__logout" to="/logout">Log out</router-link>
            </div>
          </nav>
          <div class="user-menu-bottom-btns">
            <span role="button" class="user-menu-bottom-btn user-menu-bottom-btn__skin-toggle "></span>
            <!-- QR temporary hidden -->
            <!--<span role="button" class="user-menu-bottom-btn user-menu-bottom-btn__qr"></span>-->
            <span role="button" :data-clipboard-text="'/' + user.username" :data-title="user.username"
                  class="user-menu-bottom-btn user-menu-bottom-btn__share"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",

  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  }
};
</script>
