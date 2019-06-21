<template>
  <a class="postLink" :href="`/post/${postId}`" @click.prevent="openModal">
    <img
      :src="src"
      @contextmenu.prevent="() => false"
      @dragstart.prevent="() => false"
    />
  </a>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "LinkedPhoto",
  mixins: [PostMediaPropsMixin]
};
</script>
