<template>
    <a :href="'/' + user.username" class="avatar header-avatar" v-click-outside="hide" @click="open">
        <img :src="user.avatar" />
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
    open(e) {
      if (!this.opened) {
        e.preventDefault();
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
