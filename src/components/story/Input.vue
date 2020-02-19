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
import FileUpload from "@/mixins/fileUpload";

export default {
  name: "StoryInput",
  mixins: [FileUpload],
  methods: {
    chooseFileEvent: async function(e) {
      const file = e.target.files[0];
      if (!this.isValidFileSize(file.size)) {
        return;
      }
      this.$store.dispatch("modal/show", {
        name: "createStory",
        data: {
          file
        }
      });
      e.target.value = "";
    }
  }
};
</script>
