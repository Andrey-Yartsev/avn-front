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
                <div class="mediasHeaderControls addStoryButtonWrapper hidden-desktop">
                  <button type="submit" class="addStoryButton btn" disabled>Add</button>
                  <button type="submit" class="addTextButton btn">Done</button>
                </div>
              </div>
              <div class="chat-new-type add-new-type add-new-type_b-with-text add-new-type_underline-items line-bottom">
                <AddNewNav active="story" />
              </div>
              <div class="group-controls">
                <div class="storyOptions">
                  <div class="btn-media-event picture">
                    <button type="button" class="root-btn"><span class="root-btn__inside"></span></button>
                  </div>
                  <div class="btn-media-event fullscreen">
                    <button type="button" class="root-btn"><span class="root-btn__inside"></span></button>
                  </div>
                  <div class="btn-media-event has-dropdown layers">
                    <button type="button" class="root-btn"><span class="root-btn__inside"></span></button>
                    <div class="menu">
                      <div class="options-color-definition primary">
                        <div class="options-wrapper">
                          <span class="close"></span>
                          <p>Overlay color</p>
                          <div class="options-wrap">
                            <div class="options" data-type="primary">
                              <span role="button" class="option option_col-5 option_gradient option_gradient-1 active" data-color="1"></span>
                              <span role="button" class="option option_col-5 option_gradient option_gradient-2" data-color="2"></span>
                              <span role="button" class="option option_col-5 option_gradient option_gradient-3" data-color="3"></span>
                              <span role="button" class="option option_col-5 option_gradient option_gradient-4" data-color="4"></span>
                              <span role="button" class="option option_col-5 option_gradient option_gradient-5" data-color="5"></span>
                            </div>
                          </div>
                          <div class="slider-colors-nuances">
                            <button type="button" class="clear-color-slider"></button>
                            <div class="slider-colors">
                              <input type="range">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="btn-media-event has-dropdown letters-color shown">
                    <button type="button" class="root-btn"><span class="root-btn__inside"></span></button>
                    <div class="menu">
                      <div class="options-color-definition options-color-definition_bgs primary">
                        <div class="options-wrapper">
                          <span class="close"></span>
                          <p>Text style</p>
                          <div class="font-style">
                            <ul>
                              <li><a href="#" class="font-style__strong">Strong</a></li>
                              <li><a href="#" class="font-style__modern">Modern</a></li>
                              <li><a href="#" class="font-style__type">Type</a></li>
                              <li><a href="#" class="font-style__soft">Soft</a></li>
                            </ul>
                          </div>
                          <div class="options-wrap">
                            <div class="options" data-type="primary">
                              <span role="button" class="option option_col-5 option-13 active" data-color="11"></span>
                              <span role="button" class="option option_col-5 option-14" data-color="12"></span>
                              <span role="button" class="option option_col-5 option-2" data-color="2"></span>
                              <span role="button" class="option option_col-5 option-3" data-color="3"></span>
                              <span role="button" class="option option_col-5 option-4" data-color="4"></span>
                              <span role="button" class="option option_col-5 option-5" data-color="5"></span>
                              <span role="button" class="option option_col-5 option-6" data-color="6"></span>
                              <span role="button" class="option option_col-5 option-7" data-color="7"></span>
                              <span role="button" class="option option_col-5 option-15" data-color="15"></span>
                              <span role="button" class="option option_col-5 option-11" data-color="11"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="btn-media-event letters-bg">
                    <button type="button" class="root-btn"><span class="root-btn__inside"><span class="root-btn__text">Add text</span></span></button>
                  </div>
                </div>
              </div>
              <button class="close" @click="close">
                <span class="category-name hidden-desktop">Story</span>
              </button>
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
                Post your story
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
                :src="preview.raw"
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
      <button type="button" class="close" @click="close"></button>
      <div class="next hidden"></div>
      <Loader v-if="showLoader" :fullscreen="false"></Loader>
    </div>
  </template>
</Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Loader from "@/components/common/Loader";
import AddNewNav from "@/components/addNewNav/Index";
import userMixin from "@/mixins/user";
import { getMediaFilePreview, fileUpload } from "@/utils/mediaFiles";

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
    Loader,
    AddNewNav
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
      this.preview = await getMediaFilePreview(this.file);

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
    this.chooseFileEvent();
  }
};
</script>
