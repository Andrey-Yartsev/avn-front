<template>
    <router-link class="postLink" :to="`/post/${media.id}`">
       <img :src="media.preview.source">
    </router-link>
</template>

<script>
export default {
  name: "Simple",
  props: {
    media: {
      type: Object,
      required: true
    }
  }
};
</script>
