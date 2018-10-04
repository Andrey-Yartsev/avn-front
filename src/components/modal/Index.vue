<template>
  <div class="popup">
    <div class="overlay"></div>
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: "Modal"
};
</script>
