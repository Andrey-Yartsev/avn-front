<template>
  <div>
    <img :src="media.preview.source">
  </div>
</template>

<script>
export default {
  name: "Photo",
  props: {
    media: {
      type: Object,
      required: true
    }
  }
};
</script>
