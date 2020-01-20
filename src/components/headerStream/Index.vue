<template>
  <div class="streamWrapper">
    <div id="headerStream" v-html="getIframe" />
  </div>
</template>

<script>
export default {
  computed: {
    getIframe() {
      return this.$store.state.init.data.headerStream.code;
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
