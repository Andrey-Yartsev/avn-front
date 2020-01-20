<template>
  <div class="streamWrapper" v-if="isHeaderStreamExists && !isStreamRoute">
    <div id="headerStream" v-html="getIframe" />
  </div>
</template>

<script>
export default {
  computed: {
    getIframe() {
      return this.$mq === "mobile"
        ? this.$store.state.init.data.headerStream.mobile
        : this.$store.state.init.data.headerStream.desktop;
    },
    isHeaderStreamExists() {
      return (
        this.$store.state.init &&
        this.$store.state.init.data &&
        this.$store.state.init.data.headerStream &&
        (this.$store.state.init.data.headerStream.mobile ||
          this.$store.state.init.data.headerStream.desktop)
      );
    },
    isStreamRoute() {
      return this.$route.path === "/stream";
    }
  }
};
</script>

<style lang="scss" scoped>
.streamWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
</style>
