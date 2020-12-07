<template>
  <div class="headerStreamWrapper">
    <div id="headerStream" v-html="getIframe" />
  </div>
</template>

<script>
export default {
  name: "HeaderStream",
  computed: {
    getIframe() {
      return this.$mq === "mobile"
        ? this.$store.state.init.data.headerStream.mobile
        : this.$store.state.init.data.headerStream.desktop;
    }
  }
};
</script>
