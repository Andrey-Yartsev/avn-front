<template>
  <a
    :href="'/' + user.username"
    class="avatar header-avatar"
    v-click-outside="hide"
    @click.prevent="open"
  >
    <img v-if="user.avatar" :src="user.avatar" />
  </a>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
  name: "User",

  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    showUserMobileBar() {
      return this.$store.state.global.showUserMobileBar;
    }
  },

  watch: {
    showUserMobileBar: {
      immediate: true,
      handler(show) {
        if (show) {
          this._open();
        } else {
          this._hide();
        }
      }
    }
  },

  methods: {
    open() {
      this.$store.dispatch("global/openUserMobileBar");
    },
    hide() {
      this.$store.dispatch("global/hideUserMobileBar");
    },
    _open() {
      document.body.classList.add("sidebar-shown", "disable-scroll-page");
    },
    _hide() {
      document.body.classList.remove("sidebar-shown", "disable-scroll-page");
    }
  },

  mounted() {
    this.popupItem = this.$el;
  },

  directives: {
    ClickOutside
  }
};
</script>
