<template>
  <div :class="['popup', extraClassName]">
    <div class="overlay" @click="onClose" />
    <slot name="content" />
  </div>
</template>

<script>
const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth;
};

export default {
  name: "Modal",
  methods: {
    keyUp(e) {
      if (e.keyCode === 27) {
        this.onClose(e);
      }
    }
  },
  props: {
    extraClassName: {
      type: String,
      default: ""
    },
    onClose: {
      type: Function,
      default: () => {}
    },
    path: {
      type: String
    }
  },
  mounted() {
    this.$store.commit("global/setModalOpened", true);
    document.addEventListener("keyup", this.keyUp);
    document.getElementsByTagName("body")[0].classList.add("modal-opened");
  },
  created() {
    this.$store.commit("global/setScrollBarWidth", getScrollbarWidth());
  },
  beforeDestroy() {
    this.$store.commit("global/setModalOpened", false);
    document.removeEventListener("keyup", this.keyUp);
    if (this.$store.state.global.openedModalsCount === 0) {
      document.getElementsByTagName("body")[0].classList.remove("modal-opened");
    }
  }
};
</script>
