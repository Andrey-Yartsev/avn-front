<template>
    <div class="addFileView">
        <span class="filename">
            <template v-if="media.preview">
                <img :src="media.preview" :title="media.userFileName" />
            </template>
        </span>
        <div class="progress" :style="{'width': `${media.loaded}%` }"></div>
        <span class="remove centered icon-i006" @click="$emit('removePostMedia', media.id)"></span>
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
