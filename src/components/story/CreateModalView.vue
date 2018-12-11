<template>
<Modal :onClose="close">
  <template slot="content">
    <div class="popup-container add-story-popup">
      <div class="previous hidden"></div>
      <div class="content">
        <div class="addStoryView">
          <form class="storyOverlay">
            <div class="mediasTop">
              <div class="mediasTop__header">
                <span class="category-name category-name_story hidden-mobile">Story</span>
                <button class="close" @click="close">
                  <span class="category-name hidden-desktop">Story</span>
                </button>
                <button disabled="disabled" class="newStory btn hidden-desktop">Add</button>
              </div>
            </div>
            <div class="storyPlaceholder">
              <label>
                <span>Tap here to add picture or video to your story</span>
              </label>
            </div>
            <div class="texteditor">
              <textarea maxlength="140"></textarea>
              <div class="mediasBottom">
                <button type="submit" class="addTextButton btn">Done</button>
              </div>
            </div>
            <div class="mediasBottom">
              <button type="submit" class="addStoryButton btn" :disabled="!readyToUpload" @click.prevent="createNewStory">
                Add to your story
              </button>
            </div>
            <div class="storyPreview" v-if="showPreview">
              <template v-if="preview.mediaType === 'photo'">
                <img :src="preview.preview" />
                <div class="story-block-fill" :style="{
                    'background-image': 'url('+preview.preview+')'
                  }"
                ></div>
              </template>
              <video
                ref="videoTag"
                v-if="preview.mediaType === 'video'"
                :src="preview.fileContent"
                loop="true"
              ></video>
            </div>
          </form>
          <div :class="['play-button-wrapper', {hidden: !videoError}]" @click="playPreviewVideo">
            <div class="play-button-outer">
              <div class="play-button"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="next hidden"></div>
      <Loader v-if="showLoader" :fullscreen="false"></Loader>
    </div>
  </template>
</Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Loader from "@/components/common/Loader";
import userMixin from "@/mixins/user";
import { getMediaFileMeta, fileUpload } from "@/utils/mediaFiles";

export default {
  name: "CreateModal",
  mixins: [userMixin],
  data: () => ({
    showPreview: false,
    preview: {},
    readyToUpload: false,
    videoError: false,
    showLoader: false
  }),
  components: {
    Modal,
    Loader
  },
  computed: {
    file: function() {
      return this.$store.state.modal.createStory.data.file;
    },
    newPost() {
      return this.$store.state.story.newPost;
    }
  },
  methods: {
    close(e) {
      e.preventDefault();
      this.$store.dispatch("modal/hide", { name: "createStory" });
    },
    chooseFileEvent: async function() {
      this.showLoader = true;
      this.preview = await getMediaFileMeta(this.file);

      this.showLoader = false;
      this.showPreview = true;

      if (this.preview.mediaType === "photo") {
        this.readyToUpload = true;
      }

      if (this.preview.mediaType === "video") {
        this.playPreviewVideo();
      }
    },

    createNewStory: async function() {
      this.showLoader = true;
      const processId = await fileUpload(
        { id: "story", file: this.file },
        () => {}
      );

      const newStoryData = {
        fitTypes: [],
        mediaFiles: [processId]
      };

      this.$store.dispatch("story/savePost", {
        data: newStoryData,
        userId: this.user.id
      });
    },

    playPreviewVideo: function() {
      this.$nextTick().then(() => {
        this.$refs.videoTag
          .play()
          .then(() => {
            this.readyToUpload = true;
            this.videoError = false;
          })
          .catch(() => {
            this.videoError = true;
          });
      });
    }
  },
  watch: {
    newPost() {
      this.$store.dispatch("modal/hide", { name: "createStory" });
    },
    file: function() {
      this.chooseFileEvent();
    }
  },
  mounted() {
    this.$store.dispatch("modal/hide", { name: "addPost" });
    this.chooseFileEvent();
  }
};
</script>
