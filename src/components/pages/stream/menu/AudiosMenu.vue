<template>
  <div
    v-click-outside="
      () => {
        showMenu = false;
      }
    "
    :class="[
      'btn-media-event has-dropdown microphone',
      {
        shown: showMenu,
        'device-disabled': streamAudio.deviceId === undefined
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
        v-for="(audio, key) in streamAudios"
        v-bind:key="audio.deviceId"
        type="button"
        :data-type="audio.deviceId"
        :class="['item', { active: streamAudio.deviceId === audio.deviceId }]"
        @click="() => setStreamAudio(audio)"
      >
        <span class="value">{{
          !audio.deviceId
            ? "Disable Microphone"
            : audio.label || `Microphone ${key}`
        }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
  name: "StreamMenuAudios",
  directives: {
    ClickOutside
  },
  props: {
    streamAudios: Array,
    streamAudio: null
  },
  data() {
    return {
      showMenu: false
    };
  },
  methods: {
    setStreamAudio(audio) {
      this.$emit("setStreamAudio", audio);
    }
  }
};
</script>
