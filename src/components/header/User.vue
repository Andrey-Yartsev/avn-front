<template>
  <a :href="'/' + user.username" class="avatar header-avatar" v-click-outside="hide" @click.prevent="open">
    <img v-if="user.avatar" :src="user.avatar" />
  </a>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
  name: "User",

  data() {
    return {
      opened: false
    };
  },

  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  },

  methods: {
    open() {
      if (!this.opened) {
        document.body.classList.add("sidebar-shown", "disable-scroll-page");
        this.opened = true;
      }
    },

    hide() {
      this.opened = false;
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
