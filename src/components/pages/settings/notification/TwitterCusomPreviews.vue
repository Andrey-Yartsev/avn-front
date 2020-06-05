<template>
  <div class="twitterCusomPreviews">
    <div class="modeSwitcher" @click="switchMode">
      {{ isEdit ? "View" : "Edit" }}
    </div>
    <div v-if="isEdit" class="editMode">
      <div class="previews">
        <MediaPreview
          v-for="media in preloadedMedias"
          :media="media"
          :key="media.id"
          @removeMedia="removeMedia"
          :isSaving="isSaving"
        />
      </div>
      <div class="upload">
        <label
          :class="['add-media-input', { disabled: cantAddMoreMedia }]"
          class="btn-post"
          :for="`addCustomPreview-${name}`"
        >
          <input
            :id="`addCustomPreview-${name}`"
            type="file"
            multiple
            :accept="inputAccepts"
            @change="addMediaFiles"
          />
          <span class="icn-media icn-item icn-size_lg"></span>
          <span class="btn-post__text">
            Add image
          </span>
        </label>
        <button
          class="btn save-changes"
          @click="saveNewPreviewList"
          :disabled="!isDataChanges"
        >
          Save changes
        </button>
      </div>
    </div>
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
import MediaPreview from "@/components/common/MediaPreview";
import FileUpload from "@/mixins/fileUpload";
import Common from "../common";

export default {
  name: "TwitterNotificationCustomPreview",
  mixins: [FileUpload, Common],
  components: {
    Media,
    MediaPreview
  },
  props: {
    media: {
      type: Array
    },
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isEdit: false,
      preloadedMedias: [],
      inputAcceptTypes: ["jpg", "jpeg", "png"],
      mediaType: "photo",
      saving: false,
      limits: {
        photo: 20
      }
    };
  },
  watch: {
    isEdit(value) {
      if (!value || !this.media || !this.media.length) {
        return;
      }
      this.preloadedMedias = (this.media || []).map(media => ({
        alreadySaved: true,
        fileContent: media.thumb && media.thumb.source,
        id: media.id,
        processId: media.id,
        mediaType: media.type,
        preview: media.thumb && media.thumb.source,
        thumbs: media.thumbs
      }));
    }
  },
  computed: {
    cantAddMoreMedia() {
      return this.preloadedMedias.length >= this.limits[this.mediaType];
    },
    isSaving() {
      return false;
      // if (this.$store.state.post.updatePostLoading) {
      //   return true;
      // }
      // return this.$store.state.post._createPostLoading;
    },
    inputAccepts() {
      const accepts = this.inputAcceptTypes;
      return accepts.map(i => `.${i}`).join();
    },
    allMediaTypes() {
      return [...this.inputAcceptTypes];
    },
    isDataChanges() {
      if (this.preloadedMedias.length !== this.media.length) {
        return true;
      }
      const newData = this.preloadedMedias.map(item => item.id);
      const oldData = this.media.map(item => item.id);
      return JSON.stringify(newData) !== JSON.stringify(oldData);
    }
  },
  methods: {
    switchMode() {
      this.isEdit = !this.isEdit;
    },
    saveNewPreviewList() {
      const data = this.getData();
      // if (!data || this.saving) return;
      // this.saving = true;
      console.log(data);
      // this.$store.dispatch("profile/update", data);
    },
    getData() {
      const mediaFiles = this.preloadedMedias.map(media => {
        return {
          id: media.processId
        };
      });
      const data = this.localUser;
      data.twitterNotificationsSettings.options[name].mediaFiles = mediaFiles;
      return data;
    }
  },
  mounted() {
    if (!this.media.length) {
      this.isEdit = true;
    }
  }
};
</script>
