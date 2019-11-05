<template>
  <div class="jq-toast-root-wrapper">
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
