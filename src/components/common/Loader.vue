<template>
  <div
    :class="[
      'lds-dual-ring',
      { 'not-fullscreen': !fullscreen },
      { fullscreen: fullscreen },
      { 'inline-loader': inline },
      { 'with-text': text.length },
      { 'no-text': !text.length },
      { small: small },
      { overlay_semilight: semilight },
      { overlay_semidark: semidark },
      { overlay_fulllight: fulllight }
    ]"
  >
    <div v-if="text.length" :class="['loader-text', { lowered: lowered }]">
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Loader",
  props: {
    lowered: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ""
    },
    fullscreen: {
      type: Boolean,
      default: true
    },
    inline: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    semidark: {
      type: Boolean,
      default: false
    },
    semilight: {
      type: Boolean,
      default: false
    },
    fulllight: {
      type: Boolean,
      default: false
    }
  }
};
</script>
