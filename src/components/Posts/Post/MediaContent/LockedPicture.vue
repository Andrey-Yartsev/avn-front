<template>
    <div class="locked-picture">
        <img class="locked" :src="image">
    </div>
</template>

<script>
export default {
  name: "LockedPicture",
  props: {
    media: {
      type: Object,
      required: true
    }
  },
  computed: {
    image() {
      return `data:image/jpeg;base64,${this.media.locked}`;
    }
  }
};
</script>
