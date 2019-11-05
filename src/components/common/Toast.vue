<template>
  <!-- <div class="jq-toast-wrap"> -->
  <div class="toast__item">
    <div
      class="jq-toast-single jq-has-icon"
      :class="classes"
      style="text-align: left;"
    >
      <span
        class="jq-toast-loader"
        :class="{ 'jq-toast-loaded': loaded }"
        style=""
      ></span>
      <span class="close-jq-toast-single" @click="removeHandler">×</span
      ><span v-html="toast.text"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  props: {
    toast: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loaded: false,
      hide: false
    };
  },
  computed: {
    classes() {
      const r = {
        "jq-toast-hide": this.hide
      };
      r["jq-icon-" + this.$props.toast.type] = true;
      return r;
    }
  },
  methods: {
    removeHandler() {
      this.$store.commit("global/hideToast", { id: this.toast.id });
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
      this.$store.commit("global/hideToast", { id: this.toast.id });
    }, 3500);
  }
};
</script>

<style lang="scss" scoped>
.toast__item {
  position: relative;
}
</style>
