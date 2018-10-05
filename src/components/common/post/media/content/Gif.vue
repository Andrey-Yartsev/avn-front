<template>
  <div src="postLink">
    <img :src="media.src.source">
  </div>
</template>

<script>
export default {
  name: "Gif",
  props: {
    media: {
      type: Object,
      required: true
    }
  }
};
</script>
