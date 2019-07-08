<template>
  <div
    :class="[
      'lds-dual-ring',
      { 'not-fullscreen': !fullscreen },
      { 'inline-loader': inline },
      { 'with-text': text.length }
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
