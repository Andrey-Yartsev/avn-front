<template>
  <a class="postLink" :href="`/post/${postId}`" @click.prevent="openModal">
    <audio
      controls
      src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    ></audio>
    <!-- <audio controls :src="src"></audio> -->
  </a>
</template>

<script>
import PostMediaPropsMixin from "@/mixins/post/media";

export default {
  name: "AudioLinked",
  mixins: [PostMediaPropsMixin]
};
</script>
