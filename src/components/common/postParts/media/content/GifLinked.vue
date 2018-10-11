<template>
    <a class="postLink" :href="`/post/${postId}`" @click.prevent="openModal">
        <div class="gif-player">
            <img :src="media.preview.source">
            <img class="gif-img" :src="media.src.source">
        </div>
    </a>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "GifLinked",
  mixins: [PostMediaPropsMixin]
};
</script>
