<template>
  <div class="jq-toast-wrap">
    <div
      class="jq-toast-single jq-has-icon jq-icon-success"
      :class="{ 'jq-toast-hide': hide }"
      style="text-align: left;"
    >
      <span
        class="jq-toast-loader"
        :class="{ 'jq-toast-loaded': loaded }"
        style=""
      ></span>
      <span class="close-jq-toast-single">×</span><span v-html="text"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  data() {
    return {
      loaded: false,
      hide: false
    };
  },
  computed: {
    text() {
      return this.$store.state.global.toastText;
    }
  },
  mounted() {
    this.hide = false;
    setTimeout(() => {
      this.loaded = true;
    }, 500);
    setTimeout(() => {
      this.hide = true;
    }, 3000);
    setTimeout(() => {
      this.$emit("hide");
    }, 3500);
  }
};
</script>

<style lang="scss">
.jq-toast-loader {
  transition: width 2.5s ease-in;
  background-color: #9ec600;
}
.jq-toast-wrap {
  top: 20px;
  left: 50%;
}
.jq-toast-single {
  position: relative;
  left: -50%;
  transition: opacity 0.5s ease-in;
  opacity: 1;

  &.jq-toast-hide {
    opacity: 0;
  }
}
</style>
