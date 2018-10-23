<template>
  <input
    id="storyFileSelect"
    ref="storyFileSelect"
    type="file"
    class="hidden storyFileSelect"
    accept=".jpg,.jpeg,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi"
    @change="chooseFileEvent"
  />
</template>
<script>
export default {
  name: "StoryInput",
  methods: {
    chooseFileEvent: async function(e) {
      const file = e.target.files[0];
      this.$store.dispatch("modal/show", {
        name: "createStory",
        data: {
          file
        }
      });
    }
  }
};
</script>
