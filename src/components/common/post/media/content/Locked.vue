<template>
    <div class="locked-picture">
        <img class="locked" :src="image">
    </div>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "LockedPicture",
  mixins: [PostMediaPropsMixin],
  computed: {
    image() {
      return `data:image/jpeg;base64,${this.media.locked}`;
    }
  }
};
</script>
