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
