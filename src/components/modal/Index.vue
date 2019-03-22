<template>
  <div :class="['popup', extraClassName]">
    <div class="overlay" @click="onClose"></div>
    <slot name="content"></slot>
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
    this.$nextTick(() => {
      this.$store.commit("global/setScrollBarWidth", getScrollbarWidth());
    });
  },
  beforeDestroy() {
    this.$store.commit("global/setModalOpened", false);
    document.removeEventListener("keyup", this.keyUp);
    document.getElementsByTagName("body")[0].classList.remove("modal-opened");
  }
};
</script>
