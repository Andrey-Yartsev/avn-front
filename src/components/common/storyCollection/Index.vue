<template>
  <div class="stories">
    <Story
      v-for="post in stories"
      :key="post.id"
      :post="post"
      :stories="stories"
    />
  </div>
</template>

<script>
import Story from "@/components/story/SmallHorizontalView";

export default {
  name: "StoryCollection",
  components: {
    Story
  },
  props: {
    stories: {
      type: Array,
      required: true
    }
  }
};
</script>
