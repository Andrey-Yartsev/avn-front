<template>
    <div class="addFileView">
        <span class="filename">
            <template v-if="media.preview">
                <img :src="media.preview.preview" title="media.userFileName" />
            </template>
            <template v-else>
                <span>{{ media.userFileName }}</span>
            </template>
        </span>
        <div class="loader centered"></div>
        <div class="progress"></div>
        <span class="cancel hidden centered icon-i006"></span>
        <span class="remove centered icon-i006"></span>
    </div>
</template>

<script>
export default {
  name: "MediaPreview",
  props: {
    media: {
      type: Object,
      required: true
    }
  }
};
</script>
