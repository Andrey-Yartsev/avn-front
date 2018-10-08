<template>
  <div class="popup" >
    <div class="overlay" @click="onClose"></div>
    <slot name="content" ></slot>
  </div>
</template>

<script>
export default {
  name: "Modal",
  methods: {
    keyUp(e) {
      if (e.keyCode === 27) {
        this.onClose();
      }
    }
  },
  props: {
    onClose: {
      type: Function,
      default: () => {}
    }
  },
  mounted() {
    document.addEventListener("keyup", this.keyUp);
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.keyUp);
  }
};
</script>
