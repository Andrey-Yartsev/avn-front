<template>
  <div class="postLink" @click="$emit('click')">
    <img
      :src="src"
      :style="style"
      @load="() => (loaded = true)"
      @contextmenu.prevent="() => false"
      @dragstart.prevent="() => false"
    />
  </div>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "Photo",
  mixins: [PostMediaPropsMixin],
  data: () => ({
    loaded: false
  }),
  computed: {
    style() {
      return !this.loaded ? { opacity: "0" } : {};
    }
  },
  watch: {
    src() {
      this.loaded = false;
    }
  }
};
</script>
