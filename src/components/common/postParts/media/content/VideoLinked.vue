<template>
  <a class="postLink" :href="`/post/${postId}`" @click.prevent="openModal">
    <span class="video-placeholder icn-item">
      <img
        :src="src"
        @contextmenu.prevent="() => false"
        @dragstart.prevent="() => false"
      />
    </span>
  </a>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "VideoLinked",
  mixins: [PostMediaPropsMixin]
};
</script>
