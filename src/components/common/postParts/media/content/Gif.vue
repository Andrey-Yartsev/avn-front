<template>
  <div src="postLink">
    <img :src="src" />
  </div>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "Gif",
  mixins: [PostMediaPropsMixin]
};
</script>
