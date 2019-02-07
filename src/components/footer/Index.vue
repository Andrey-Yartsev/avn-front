<template>
  <component :is="footer" />
</template>

<script>
export default {
  computed: {
    footer() {
      return "rl-footer";
    }
  }
};
</script>
