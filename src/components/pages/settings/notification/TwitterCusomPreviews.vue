<template>
  <div class="twitterCusomPreviews">
    <div v-if="isEdit" class="editMode"></div>
    <div v-else class="viewMode">
      <Media
        v-if="media && media.length"
        :medias="media"
        :shouldHasLink="false"
        :post="{}"
        :authorId="123"
        mediaSize="preview"
        :autoplay="false"
      />
    </div>
  </div>
</template>

<script>
import Media from "@/components/post/parts/media/Index";

export default {
  name: "TwitterNotificationCustomPreview",
  components: {
    Media
  },
  props: {
    media: {
      type: Array
    }
  },
  data() {
    return {
      isEdit: false
    };
  }
};
</script>
