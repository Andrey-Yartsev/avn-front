<template>
    <div class="locked-picture">
        <img class="locked" :src="image">
    </div>
</template>

<script>
export default {
  name: "LockedPicture",
  props: {
    base64: {
      type: String,
      required: true
    }
  },
  computed: {
    image() {
      return `data:image/jpeg;base64,${this.base64}`;
    }
  }
};
</script>
