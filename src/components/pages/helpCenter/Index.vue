<template>
  <div class="staticPage">
    <div class="container contact-page">
      <h1>Help Center</h1>
      <p>Some text</p>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("support/fetch");
  }
};
</script>
