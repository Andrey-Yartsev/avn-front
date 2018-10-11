<template>
  <div src="postLink">
    <img :src="media.src.source">
  </div>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "Gif",
  mixins: [PostMediaPropsMixin]
};
</script>
