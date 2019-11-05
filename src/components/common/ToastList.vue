<template>
  <div class="wrapper">
    <Toast v-for="toast in toasts" :key="toast.id" :toast="toast" />
  </div>
</template>

<script>
import Toast from "./Toast";
export default {
  name: "ToastList",
  components: {
    Toast
  },
  props: {
    toasts: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: block;
  position: fixed;
  width: 250px;
  height: auto;
  z-index: 9000 !important;
  top: 20px;
  left: 50%;
}
</style>
