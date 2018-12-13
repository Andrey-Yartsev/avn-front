<template>
  <div class="stories">
		<Stream />
		<Stream />
		<Stream />
		<Stream />
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
