<template>
  <Modal :onClose="close">
    <template slot="content">
      <div class="popup-container add-story-popup">
        <div class="content">
          <div class="addStoryView bg-gradient bg-gradient_standart">
            <form class="storyOverlay">
              <div class="mediasTop">
                <div class="mediasTop__header story-header">
                  <span
                    class="category-name category-name_story hidden-mobile icn-item icn-size_lg"
                    v-if="$mq === 'desktop'"
                    >Story</span
                  >
                  <button
                    class="close close_light close_visible-mob icn-item icn-size_lg"
                    @click="close"
                  >
                    <span
                      class="category-name hidden-desktop"
                      v-if="$mq === 'mobile'"
                      >Story</span
                    >
                  </button>
                  <button
                    class="newStory btn btn_white btn_white-default sm hidden-desktop"
                    v-if="$mq === 'mobile'"
                    @click.prevent="createNewStory"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div class="mediasBottom">
                <button
                  type="submit"
                  class="addStoryButton btn lg block btn-center btn_fix-width-lg btn_not-bold btn_white btn_white-alfabg"
                  :disabled="!readyToUpload"
                  @click.prevent="createNewStory"
                >
                  Add to your story
                </button>
                <div
                  class="story-text-info"
                  v-if="preview.mediaType === 'video'"
                >
                  Videos over 60 sec will be trimmed
                </div>
              </div>
              <div class="storyPreview" v-if="showPreview">
                <template v-if="preview.mediaType === 'photo'">
                  <img :src="preview.preview" class="storyPreview__img" />
                  <div
                    v-if="preview.preview"
                    class="story-block-fill"
                    :style="{
                      'background-image': 'url(' + preview.preview + ')'
                    }"
                  ></div>
                </template>
                <video
                  ref="videoTag"
                  v-if="preview.mediaType === 'video' && preview.fileContent"
                  :src="preview.fileContent"
                  class="storyPreview__video"
                  loop="true"
                  @contextmenu.prevent="() => false"
                  @dragstart.prevent="() => false"
                />
              </div>
              <div
                v-if="preview.mediaType === 'video' && preview.fileContent"
                :class="['play-button-wrapper', { hidden: !videoError }]"
                @click="playPreviewVideo"
              >
                <div class="play-button" />
              </div>
              <div
                v-if="
                  preview.mediaType === 'video' &&
                    !preview.fileContent &&
                    !showLoader
                "
                :class="['play-button-wrapper']"
              >
                <div class="play-button" />
              </div>
            </form>
          </div>
        </div>
        <div class="loader-container loader-container_center" v-if="showLoader">
          <Loader
            :fullscreen="false"
            text="Uploading..."
            :semidark="true"
            class="text-light"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Loader from "@/components/common/Loader";
import userMixin from "@/mixins/user";
import {
  getMediaFileMeta,
  fileUpload,
  getImagePreview,
  readFileContent
} from "@/utils/mediaFiles2";

export default {
  name: "StoryCreateModal",
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
      this._close();
    },
    _close() {
      this.$store.dispatch("modal/hide", { name: "createStory" });
    },
    chooseFileEvent: async function() {
      const media = getMediaFileMeta(this.file);
      const { mediaType, size } = media;
      const isLargeVideo = mediaType === "video" && size > 50000000;

      const defaultPreview = {
        mediaType,
        fileContent: null
      };

      this.showLoader = true;

      if (isLargeVideo) {
        this.preview = defaultPreview;
        this.readyToUpload = true;
        this.showLoader = false;
        this.showPreview = true;
        return;
      }

      const getPreviewMethod =
        mediaType === "video" ? readFileContent : getImagePreview;

      getPreviewMethod(media, newMedia => {
        this.preview = newMedia;
        this.readyToUpload = true;
        this.showLoader = false;
        this.showPreview = true;

        if (mediaType === "video") {
          this.playPreviewVideo();
        }
      });
    },

    createNewStory: async function() {
      this.stopPreviewVideo();
      this.showLoader = true;
      fileUpload({ id: "story", file: this.file }, () => {})
        .then(({ processId }) => {
          const newStoryData = {
            fitTypes: [],
            mediaFiles: [{ id: processId }]
          };

          this.$store.dispatch("story/savePost", {
            data: newStoryData,
            userId: this.user.id
          });
        })
        .catch(err => {
          this.$store.dispatch("global/flashToast", {
            text: err.message,
            type: "error"
          });
          this._close();
        });
    },

    playPreviewVideo: function() {
      this.$nextTick().then(() => {
        if (this.$refs.videoTag) {
          this.$refs.videoTag
            .play()
            .then(() => {
              this.readyToUpload = true;
              this.videoError = false;
            })
            .catch(() => {
              this.readyToUpload = true;
              this.videoError = true;
            });
        } else {
          this.readyToUpload = true;
        }
      });
    },

    stopPreviewVideo() {
      if (this.$refs.videoTag) {
        this.$refs.videoTag.pause();
      }
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
