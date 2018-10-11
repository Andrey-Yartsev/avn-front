<template>
    <a class="postLink" :href="`/post/${postId}`" @click.prevent="openModal">
       <img :src="media.preview.source" >
    </a>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/postMedia";

export default {
  name: "LinkedPhoto",
  mixins: [PostMediaPropsMixin]
};
</script>
