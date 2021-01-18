<template>
  <div
    v-click-outside="
      () => {
        showMenu = false;
      }
    "
    :class="[
      'btn-media-event has-dropdown streamSettings',
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
        v-for="type in streamTypes"
        v-bind:key="type"
        type="button"
        :data-type="type"
        :class="['item', { active: type === streamType }]"
        @click="() => setStreamType(type)"
      >
        <span class="value">{{ type.toUpperCase() }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
  name: "StreamTypeMenu",
  directives: {
    ClickOutside
  },
  props: {
    streamType: {
      type: String,
      default: "webrtc"
    }
  },
  data() {
    return {
      showMenu: false,
      streamTypes: ["webrtc", "hls"]
    };
  },
  methods: {
    setStreamType(type) {
      this.showMenu = false;
      this.$emit("setStreamType", type);
    }
  }
};
</script>
