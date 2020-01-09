<template>
  <div
    :class="['addPost', { loaderWrap: saving, truncated: !user.isPerformer }]"
    v-click-outside="() => (expanded = false)"
  >
    <form
      :class="[
        'add-new-form',
        {
          expanded: isExtended,
          'bg-gradient_light': $mq === 'desktop'
        }
      ]"
    >
      <div class="addPost-header" v-if="$mq === 'mobile'">
        <button
          type="button"
          class="header-return-btn go-back go-back_times"
          @click="close"
        >
          <h1 class="category-name">
            Edit video
          </h1>
        </button>
        <div class="addPost-header__controls">
          <button
            type="submit"
            class="btn submit sm"
            :disabled="!isDataChanged || isMediaLoading"
            @click.prevent="saveClickHandler"
          >
            Save
          </button>
        </div>
      </div>
      <span
        class="avatar avatar_not-shadow avatar_gap-r-md avatar_sm hidden-mobile"
        v-if="$mq === 'desktop'"
      >
        <span class="avatar__img">
          <img v-if="user.avatar" :src="user.avatar" />
        </span>
      </span>
      <textarea
        contenteditable
        class="textarea__title"
        :class="{ 'text-clear-border': $mq === 'mobile' }"
        placeholder="Enter title here"
        maxlength="200"
        v-model="media.title"
        ref="textareaTitle"
        :disabled="saving"
      ></textarea>
      <div
        class="text-media-container ml-auto"
        :class="{ 'text-field-border': $mq === 'desktop' }"
      >
        <vue-tribute :options="tributeOptions">
          <textarea
            @focus="() => (expanded = true)"
            class="sm content-editable textarea"
            contenteditable
            placeholder="Enter description here"
            maxlength="1000"
            v-model="media.text"
            ref="textarea"
            :disabled="saving"
          ></textarea>
        </vue-tribute>
        <div class="post-attachment">
          <div class="block-thumbnails" v-if="!customThumbAdded">
            <div class="block-thumbnails__title">Choose cover</div>
            <div class="addFileCollectionView thumbList">
              <div
                v-for="thumb in media.thumbs"
                :key="thumb.id"
                class="addFileView addFileView_option icn-item"
                :class="{
                  current: media.thumbId === thumb.id
                }"
                @click="media.thumbId = thumb.id"
              >
                <div class="filename filename_sm">
                  <img :src="thumb.url" />
                </div>
              </div>
            </div>
          </div>
          <Draggable v-model="preloadedMedias" v-if="customThumbAdded">
            <div class="block-thumbnails__title">Custom cover</div>
            <transition-group
              class="addFileCollectionView"
              type="transition"
              name="flip-list"
            >
              <MediaPreview
                v-for="media in preloadedPhotoMedias"
                :media="media"
                :key="media.id"
                @removeMedia="removeMedia"
                :isSaving="false"
              />
            </transition-group>
          </Draggable>
          <Draggable v-model="preloadedMedias" v-if="customPreviewAdded">
            <div class="block-thumbnails__title">Custom video preview</div>
            <transition-group
              class="addFileCollectionView"
              type="transition"
              name="flip-list"
            >
              <MediaPreview
                v-for="media in preloadedVideoMedias"
                :media="media"
                :key="media.id"
                @removeMedia="removeMedia"
                :isSaving="false"
              />
            </transition-group>
          </Draggable>
        </div>
      </div>
      <div class="actions">
        <div class="actions-controls alignFlexCenter">
          <template v-if="isExtended">
            <div class="btn-post">
              <div>Price</div>
              <div
                class="price-amount-field getPaidForm__field enabled-tooltip"
              >
                <input
                  type="number"
                  name="paidPrice"
                  placeholder="Enter price"
                  class="getPaidAmountPlaceholder"
                  v-model="media.price"
                  step="0.01"
                  min="0"
                  :max="maxPrice"
                />
              </div>
              <div class="b-check-state b-check-state_post alignFlexCenter">
                <label>
                  <input
                    class="is-free-post"
                    type="checkbox"
                    v-model="media.active"
                  />
                  <span
                    class="b-check-state__icon icn-item icn-size_lg ml-2"
                  ></span>
                  <span class="b-check-state__text">Active</span>
                </label>
              </div>
              <div class="b-check-state b-check-state_post alignFlexCenter">
                <label>
                  <input
                    class="is-free-post"
                    type="checkbox"
                    v-model="media.free"
                  />
                  <span
                    class="b-check-state__icon icn-item icn-size_lg ml-2"
                  ></span>
                  <span class="b-check-state__text">Free</span>
                </label>
              </div>
            </div>

            <input
              id="addFile"
              type="file"
              multiple
              :accept="inputAccepts"
              @change="addMediaFiles"
            />
            <input
              id="addFilePreview"
              type="file"
              multiple
              :accept="inputAcceptsPreview"
              @change="addMediaFiles"
            />

            <div
              :class="['more-functions', { open: dropdownOpened }]"
              v-click-outside="hideDropdown"
            >
              <div class="more-functions__overlay" @click="hideDropdown"></div>
              <div class="customPreview" @click="showDropdown">
                Custom preview
              </div>
              <div class="more-functions__dropdown">
                <ThumbDropdown
                  :hide="hideDropdown"
                  @addThumb="addThumb"
                  @addPreview="addPreview"
                  :showThumbOption="!customThumbAdded"
                  :showPreviewOption="!customPreviewAdded"
                />
              </div>
            </div>
          </template>
        </div>
        <button
          type="submit"
          class="btn submit hidden-mobile"
          :disabled="!isDataChanged || isMediaLoading"
          @click.prevent="saveClickHandler"
          v-if="$mq === 'desktop'"
        >
          Save
        </button>
      </div>
      <div class="loader-container loader-container_center" v-if="saving">
        <Loader
          :fullscreen="false"
          :small="true"
          :semidark="true"
          class="text-light"
        />
      </div>
    </form>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import ClickOutside from "vue-click-outside";
import { Settings } from "luxon";
import UserMixin from "@/mixins/user";
import "vue-datetime/dist/vue-datetime.css";
import VueTribute from "vue-tribute";
import UserSuggestions from "@/mixins/userSuggestions";
import FileUpload from "@/mixins/fileUpload";
import MediaPreview from "@/components/common/MediaPreview";
import Draggable from "vuedraggable";
import ThumbDropdown from "./ThumbDropdown.vue";

Settings.defaultLocale = "en";

const InitialState = {
  expanded: false,
  media: {
    active: false,
    title: "",
    text: "",
    price: 0,
    free: false,
    thumbId: null,
    thumbs: []
  },
  saving: false,
  withoutWatermark: false,
  maxPrice: 500,
  dropdownOpened: false,
  allowMultipleFileTypes: true
};

export default {
  name: "EditMedia",
  mixins: [UserMixin, UserSuggestions, FileUpload],
  data() {
    return {
      ...InitialState
    };
  },
  components: {
    Loader,
    VueTribute,
    MediaPreview,
    Draggable,
    ThumbDropdown
  },
  props: {
    initialExpanded: {
      type: Boolean,
      default: false
    },
    close: {
      type: Function,
      default: () => {}
    },
    post: {
      type: Object,
      default: () => ({})
    },
    where: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    hasSubscribePrice() {
      return this.$store.state.auth.user.subscribePrice > 0;
    },
    isExtended() {
      return this.expanded || this.initialExpanded;
    },
    isMediaLoading() {
      if (!this.preloadedMedias.length) {
        return false;
      }
      return this.preloadedMedias.some(item => !item.processId);
    },
    isDataChanged() {
      return (
        this.$props.post.title !== this.media.title ||
        this.$props.post.text !== this.media.text ||
        this.$props.post.active !== this.media.active ||
        String(this.$props.post.price) !== String(this.media.price) ||
        this.$props.post.media.thumbId !== this.media.thumbId ||
        this.preloadedPhotoMedias.length ||
        this.preloadedVideoMedias.length
      );
    },
    isPriceSetLimit() {
      return +this.media.price > 0 && +this.media.price <= 500;
    },
    inputAccepts() {
      return ".jpg, .jpeg, .png";
    },
    inputAcceptsPreview() {
      return ".mp4, .avi, .moov, .mov, .m4v, .wmv";
    },
    allMediaTypes() {
      return ["jpg", "jpeg", "png", "mp4", "avi", "moov", "mov", "m4v", "wmv"];
    },
    customThumbAdded() {
      if (!this.preloadedMedias.length) {
        return false;
      }
      return !!this.preloadedMedias.find(item => item.mediaType === "photo");
    },
    customPreviewAdded() {
      if (!this.preloadedMedias.length) {
        return false;
      }
      return !!this.preloadedMedias.find(item => item.mediaType === "video");
    },
    preloadedPhotoMedias() {
      if (!this.preloadedMedias.length) {
        return [];
      }
      return this.preloadedMedias.filter(item => item.mediaType === "photo");
    },
    preloadedVideoMedias() {
      if (!this.preloadedMedias.length) {
        return [];
      }
      return this.preloadedMedias.filter(item => item.mediaType === "video");
    }
  },
  watch: {
    ["media.price"](value) {
      if (value == 0) {
        this.media.free = true;
      } else {
        this.media.free = false;
      }
    },
    ["media.free"](value) {
      if (value == true) {
        this.media.price = 0;
      }
    }
  },
  methods: {
    hideDropdown() {
      this.dropdownOpened = false;
    },
    showDropdown() {
      this.dropdownOpened = true;
    },
    addThumb() {
      const input = document.getElementById("addFile");
      if (!input) {
        return;
      }
      input.click();
    },
    addPreview() {
      const input = document.getElementById("addFilePreview");
      if (!input) {
        return;
      }
      input.click();
    },
    getConvertedText() {
      const pattern =
        '<span class="emoji-outer emoji-sizer"><span class="emoji-inner emoji.+?" data-code="(.+?)"></span></span>';
      let text = this.post.text.replace(
        new RegExp(pattern, "ug"),
        (m, unicode) => {
          return unicode;
        }
      );
      text = text.replace(/<br \/>/g, "\n");
      return text.replace(/(<([^>]+)>)/gi, "");
    },
    initData() {
      const {
        title,
        text,
        price,
        active,
        media: { thumbs, thumbId }
      } = this.$props.post;
      this.media.title = title;
      this.media.text = text;
      this.media.price = price;
      this.media.active = active;
      this.media.thumbId = thumbId;
      this.media.thumbs = thumbs;
    },
    clearData() {
      this.media.title = "";
      this.media.text = "";
      this.media.price = 0;
      this.media.active = false;
      this.media.free = false;
      this.media.thumbId = null;
      this.media.thumbs = [];
    },
    saveClickHandler() {
      this.saving = true;
      this.$store
        .dispatch("profile/media/updateMedia", this.getMediaDataToUpdate(), {
          root: true
        })
        .then(() => {
          console.log("updated");
          this.saving = false;
          this.close();
        });
    },
    getMediaDataToUpdate() {
      const customThumb = this.preloadedMedias.length
        ? this.preloadedMedias.find(item => item.mediaType === "photo")
        : undefined;
      const customPreview = this.preloadedMedias.length
        ? this.preloadedMedias.find(item => item.mediaType === "video")
        : undefined;

      const data = {
        media: { ...this.media },
        productId: this.$props.post.productId
      };

      if (customThumb) {
        data.media.customThumb = {
          id: customThumb.processId
        };
      }
      if (customPreview) {
        data.media.customPreview = {
          id: customPreview.processId
        };
      }
      return data;
    }
  },
  mounted() {
    this.initData();
  },
  beforeDestroy() {
    this.clearData();
  },
  directives: {
    ClickOutside
  }
};
</script>

<style lang="scss" scoped>
.alignFlexCenter {
  display: flex;
  align-items: center;
}
.ml-2 {
  margin-left: 10px;
}
.ml-auto {
  margin-left: auto;
}
.textarea__title {
  flex: 0 0 calc(100% - 45px);
  border-radius: 6px;
  box-shadow: 0 0 0 2px #2196f333;
  background-color: white;
  position: relative;
  z-index: 1;
  padding-top: 13px;
  padding-bottom: 0;

  &.text-clear-border {
    margin-top: 50px;
    padding: 25px 15px;
    padding-bottom: 0;
    box-shadow: none;
    font-size: 17px;
    position: relative;
  }
}
.customPreview {
  cursor: pointer;
  color: #2196f3;
  font-weight: bold;
}
.thumbList {
  flex-wrap: wrap;
}
</style>
