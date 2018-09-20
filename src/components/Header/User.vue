<template>
    <a href="/alexeionline" class="avatar header-avatar" v-click-outside="hide" @click="open">
        <img src="https://media.team2.retloko.com/files/f/fu/fuv/fuvehoth2zqjgua11c8akpdcxgr3dvvw1537170622/2afff3a23099780908097f84bc5da2fd_normal.jpeg" />
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
