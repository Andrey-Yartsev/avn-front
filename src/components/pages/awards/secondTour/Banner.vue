<template>
  <div class="banner">
    <h1 class="banner__title">{{ title }}</h1>
    <div class="banner__text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: "Banner",
  props: {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
};
</script>
