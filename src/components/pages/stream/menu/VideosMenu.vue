<template>
  <div
    v-if="$mq === 'desktop' && streamVideos && streamVideos.length > 1"
    v-click-outside="
      () => {
        showMenu = false;
      }
    "
    :class="[
      'btn-media-event has-dropdown camera',
      {
        shown: showMenu,
        'device-disabled': streamVideo.deviceId === 'disabled'
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
        v-for="(video, key) in streamVideos"
        v-bind:key="video.deviceId"
        type="button"
        :data-type="video.deviceId"
        :class="['item', { active: streamVideo.deviceId === video.deviceId }]"
        @click="() => setStreamVideo(video)"
      >
        <span class="value">{{ video.label || `Camera ${key}` }}</span>
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
    streamVideos: Array,
    streamVideo: null
  },
  data() {
    return {
      showMenu: false
    };
  },
  methods: {
    setStreamVideo(video) {
      this.showMenu = false;
      this.$emit("setStreamVideo", video);
    }
  }
};
</script>
