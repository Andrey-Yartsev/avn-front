<template>
  <div
    v-click-outside="
      () => {
        showMenu = false;
      }
    "
    :class="[
      'btn-media-event has-dropdown notifications',
      {
        shown: showMenu
      }
    ]"
  >
    <button
      type="button"
      class="root-btn"
      @click="
        () => {
          showMenu = true;
        }
      "
    >
      <span class="root-btn__inside" />
    </button>
    <div
      class="menu-overlay"
      @click="
        () => {
          showMenu = false;
        }
      "
    ></div>
    <div class="menu">
      <button
        type="button"
        :class="['item', { active: isEnabled('newLook') }]"
        @click="() => switchNotifications('newLook')"
      >
        <span class="value">New user comes alert</span>
      </button>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
  name: "StreamMenuNotifications",
  directives: {
    ClickOutside
  },
  data() {
    return {
      showMenu: false
    };
  },
  methods: {
    switchNotifications(name) {
      this.$store.dispatch("lives/notifications/switch", name);
    },
    isEnabled(name) {
      return this.$store.state.lives.notifications[name];
    }
  }
};
</script>
