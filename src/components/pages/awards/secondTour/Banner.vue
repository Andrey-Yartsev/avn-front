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

<style lang="scss" scoped>
.banner {
  &__text {
    margin-top: 20px;
    background-color: #ccebf6;
    padding: 20px;
    border: 1px solid #a7cbe6;
    border-radius: 5px;
    color: #2073af;
  }
}
</style>
