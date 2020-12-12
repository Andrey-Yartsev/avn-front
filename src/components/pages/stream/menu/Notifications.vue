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
      <button :class="['item', { active: allEnabled }]" @click="allAction">
        <span class="value">{{ allTitle }}</span>
      </button>
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
    },
    allDisabled() {
      return notifications.every(v => {
        return !this.isEnabled(v.name);
      });
    },
    allEnabled() {
      return notifications.every(v => {
        return this.isEnabled(v.name);
      });
    },
    allTitle() {
      return this.allDisabled ? "Enable all" : "Disable all";
    }
  },
  methods: {
    switchNotifications(name) {
      this.$store.dispatch("lives/notifications/switch", name);
    },
    isEnabled(name) {
      return this.$store.state.lives.notifications[name];
    },
    allAction() {
      if (this.allDisabled) {
        notifications.forEach(v => {
          this.$store.dispatch("lives/notifications/setEnabled", {
            name: v.name,
            isEnabled: true
          });
        });
      } else {
        notifications.forEach(v => {
          this.$store.dispatch("lives/notifications/setEnabled", {
            name: v.name,
            isEnabled: false
          });
        });
      }
    }
  }
};
</script>
