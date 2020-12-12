<template>
  <div
    class="btn-media-event has-dropdown stream-visibility subscribers"
    :class="{ shown }"
    v-click-outside="
      () => {
        shown = false;
      }
    "
  >
    <button type="button" class="root-btn" @click="shown = !shown">
      <span class="root-btn__inside">{{ selected.label }}</span>
    </button>
    <div class="menu-overlay"></div>
    <div class="menu">
      <button
        type="button"
        v-for="v in streamVisibilities"
        v-bind:key="v.key"
        class="item"
        :class="{ active: v.selected }"
        @click="() => setStreamVisibility(v.key)"
        :disabled="v.disabled"
      >
        <span class="value">{{ v.label }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import User from "@/mixins/user";
import ClickOutside from "vue-click-outside";

export default {
  name: "StreamObsAccessFilter",
  mixins: [User],
  directives: {
    ClickOutside
  },
  data() {
    return {
      shown: false
    };
  },
  props: {
    value: String
  },
  computed: {
    streamVisibilities() {
      const r = [
        {
          key: "subscribers",
          label: "Subscribers only",
          disabled:
            !this.canEarn ||
            !this.user.isWantEarn ||
            this.user.subscribePrice <= 0
        },
        {
          key: "followers",
          label: "Followers only",
          disabled: false
        },
        {
          key: "public",
          label: "Everyone",
          disabled: false
        }
      ];
      if (this.user.streamGroups?.length) {
        this.user.streamGroups.forEach(item => {
          r.push({
            key: item.key,
            label: item.label,
            disabled: false
          });
        });
      }
      return r.map(v => {
        if (this.value === v.key) {
          v.selected = true;
        }
        return v;
      });
    },
    selected() {
      return this.streamVisibilities.find(v => v.selected);
    }
  },
  methods: {
    setStreamVisibility(type) {
      this.shown = false;
      this.$emit("changed", type);
    }
  }
};
</script>
