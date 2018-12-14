<template>
  <div class="stories">
    <Stream
      v-for="post in stories"
      :key="post.id"
      :post="post"
    />
  </div>
</template>

<script>
import Stream from "@/components/stream/SmallHorizontalView";

export default {
  name: "StreamCollection",
  components: {
    Stream
  },
  props: {
    stories: {
      type: Array,
      required: true
    }
  }
};
</script>
