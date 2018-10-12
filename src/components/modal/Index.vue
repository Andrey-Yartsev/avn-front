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
    document.getElementsByTagName("body")[0].classList.add("modal-opened");
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.keyUp);
    document.getElementsByTagName("body")[0].classList.remove("modal-opened");
  }
};
</script>
