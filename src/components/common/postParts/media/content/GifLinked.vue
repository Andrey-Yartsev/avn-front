<template>
    <a class="postLink" :href="`/post/${postId}`" @click.prevent="openModal">
        <div class="gif-player">
            <img :src="src">
            <img class="gif-img" :src="src">
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
