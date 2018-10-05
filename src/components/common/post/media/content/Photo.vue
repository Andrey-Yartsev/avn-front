<template>
  <div class="postLink">
    <img :src="media.preview.source">
  </div>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "Photo",
  mixins: [PostMediaPropsMixin]
};
</script>
