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
        v-for="(v, k) in items"
        :key="k"
        type="button"
        :class="['item', { active: isEnabled(v.name) }]"
        @click="() => switchNotifications(v.name)"
      >
        <span class="value">{{ v.title }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
import notifications from "../notifications";

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
  computed: {
    items() {
      return notifications;
    }
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
