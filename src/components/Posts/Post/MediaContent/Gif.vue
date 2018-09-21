<template>
    <router-link class="postLink" :to="`/post/${media.id}`">
        <div class="gif-player">
            <img :src="media.preview.source">
        </div>
    </router-link>
</template>

<script>
export default {
  name: "Gif",
  props: {
    media: {
      type: Object,
      required: true
    }
  }
};
</script>
