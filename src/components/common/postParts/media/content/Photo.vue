<template>
  <div class="postLink">
    <img :src="src">
  </div>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "Photo",
  mixins: [PostMediaPropsMixin]
};
</script>
