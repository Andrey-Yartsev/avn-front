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
            @input="textInput"
            ref="textarea"
            :disabled="saving"
          ></textarea>
        </vue-tribute>
        <div class="post-attachment" v-if="post.media.type === 'video'">
          <div class="block-thumbnails" v-if="!customThumbAdded">
            <div class="block-thumbnails__title">Choose cover</div>
            <div class="addFileCollectionView thumbList">
              <div
                v-for="thumb in media.thumbs"
                :key="thumb.id"
                class="asd addFileView addFileView_option icn-item"
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
      <div class="actions editMediaActions">
        <div class="actions-controls alignFlexCenter">
          <template v-if="isExtended">
            <div class="categories" v-if="mediaCategories.length">
              <div>Categories:</div>
              <div class="categoriesContainer">
                <template v-for="category in mediaCategories">
                  <label class="form-group-inner" :key="category.id">
                    <div class="checkbox-wrapper">
                      <input
                        type="checkbox"
                        :id="category.id"
                        :value="category.id"
                        :disabled="
                          isMaxCategoriesLimitSelected &&
                            media.categories.indexOf(Number(category.id)) === -1
                        "
                        v-model="media.categories"
                      />
                      <span class="label icn-item">{{ category.name }}</span>
                    </div>
                  </label>
                </template>
              </div>
            </div>
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
              v-if="post.media.type === 'video'"
              :class="[
                'more-functions',
                { open: dropdownOpened, previewDropdown: $mq === 'desktop' }
              ]"
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
                  @removePreview="removePreview"
                  :videoPreview="post.media.videoPreview"
                  :removeVideoPreview="media.removeVideoPreview"
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
// import mediaCategories from "@/mock/mediaCategories";

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
    thumbs: [],
    removeVideoPreview: false,
    pinned: false,
    categories: []
  },
  saving: false,
  defaultPriceLimit: 500,
  withoutWatermark: false,
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
        this.getConvertedText(this.$props.post.text) !==
          this.getConvertedText(this.media.text) ||
        this.$props.post.pinned !== this.media.pinned ||
        this.$props.post.active !== this.media.active ||
        String(this.$props.post.price) !== String(this.media.price) ||
        this.$props.post.media.thumbId !== this.media.thumbId ||
        this.preloadedPhotoMedias.length ||
        [].join(",") !== this.media.categories.join(",") ||
        this.preloadedVideoMedias.length ||
        this.media.removeVideoPreview ||
        this.$props.post.categories.length !== this.media.categories.length
      );
    },
    isMaxCategoriesLimitSelected() {
      return this.media.categories.length === 2;
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
    },
    mediaCategories() {
      return this.$store.state.profile.media.mediaCategories;
    },
    maxPrice() {
      if (
        this.user.payments &&
        this.user.payments.tipsLimit &&
        this.user.payments.tipsLimit.max
      ) {
        return this.user.payments.tipsLimit.max;
      }
      return this.defaultPriceLimit;
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
    removePreview() {
      this.media.removeVideoPreview = !this.media.removeVideoPreview;
    },
    getConvertedText(text) {
      const pattern =
        '<span class="emoji-outer emoji-sizer"><span class="emoji-inner emoji.+?" data-code="(.+?)"></span></span>';
      let convertedText = text.replace(
        new RegExp(pattern, "ug"),
        (m, unicode) => {
          return unicode;
        }
      );
      convertedText = convertedText.replace(/<br \/>/g, "\n");
      return convertedText.replace(/(<([^>]+)>)/gi, "");
    },
    initData() {
      const {
        title,
        text,
        price,
        active,
        pinned,
        media: { thumbs, thumbId },
        categories
      } = this.$props.post;
      this.media.title = title;
      this.media.text = this.getConvertedText(text);
      this.media.price = price;
      this.media.active = active;
      this.media.thumbId = thumbId;
      this.media.thumbs = thumbs;
      this.media.pinned = pinned || false;
      this.media.categories = categories || [];
      this.$refs.textarea.value = this.getConvertedText(text);
    },
    clearData() {
      this.media.title = "";
      this.media.text = "";
      this.media.price = 0;
      this.media.active = false;
      this.media.free = false;
      this.media.thumbId = null;
      this.media.thumbs = [];
      this.media.removeVideoPreview = false;
      this.media.pinned = false;
      this.media.categories = [];
    },
    saveClickHandler() {
      if (this.overMaxPrice()) {
        this.$store.dispatch(
          "global/flashToast",
          { text: `Max price limit is $${this.maxPrice}`, type: "error" },
          {
            root: true
          }
        );
        return;
      }
      this.saving = true;
      this.$store
        .dispatch("profile/media/updateMedia", this.getMediaDataToUpdate(), {
          root: true
        })
        .then(() => {
          this.saving = false;
          this.close();
        });
    },
    getMediaDataToUpdate() {
      const customThumb = this.preloadedMedias.length
        ? this.preloadedMedias.find(item => item.mediaType === "photo")
        : undefined;
      const videoPreview = this.preloadedMedias.length
        ? this.preloadedMedias.find(item => item.mediaType === "video")
        : undefined;

      const data = {
        media: {
          ...this.media,
          categories: this.media.categories.map(item => +item)
        },
        productId: this.$props.post.productId
      };

      if (customThumb) {
        data.media.customThumb = {
          id: customThumb.processId
        };
      }
      if (videoPreview) {
        data.media.videoPreview = {
          id: videoPreview.processId
        };
        data.media.removeVideoPreview = false;
      }
      return data;
    },
    textInput() {
      this.media.text = this.$refs.textarea.value;
    },
    overMaxPrice() {
      return this.media.price > this.maxPrice;
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
.actions {
  &.editMediaActions {
    flex-flow: column;
    .actions-controls {
      margin-bottom: 10px;
      flex-wrap: wrap;
    }
    .btn.submit {
      align-self: flex-end;
    }
  }
}
.previewDropdown {
  margin-left: auto;
}
.categories {
  width: 100%;
}
.title {
  margin-bottom: 10px;
}
.categoriesContainer {
  display: flex;
  flex-flow: row wrap;
}
.form-group-inner {
  margin-top: 5px;
  margin-right: 10px;
  /* flex-grow: 1;
  flex-basis: 33.33%; */
}
.withPadding {
  padding: 0 10px;
}
</style>
