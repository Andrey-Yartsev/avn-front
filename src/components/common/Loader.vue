<template>
  <div
    :class="[
      'lds-dual-ring with-text',
      { 'not-fullscreen': !fullscreen },
      { 'inline-loader': inline }
    ]"
  >
    <div :class="['loader-text', { lowered: lowered }]">{{ text }}</div>
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
      default: "Loading"
    },
    fullscreen: {
      type: Boolean,
      default: true
    },
    inline: {
      type: Boolean,
      default: false
    }
  }
};
</script>
