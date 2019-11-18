<template>
  <div src="postLink">
    <img :src="src" />
  </div>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/post/media";

export default {
  name: "Gif",
  mixins: [PostMediaPropsMixin]
};
</script>
