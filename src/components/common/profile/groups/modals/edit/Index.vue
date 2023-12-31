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
          <h1 class="category-name">Edit group</h1>
        </button>
        <div class="addPost-header__controls">
          <button
            type="submit"
            class="btn submit sm"
            :disabled="isMediaLoading || notEhoughData"
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
        maxlength="50"
        v-model="group.title"
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
        <div class="post-attachment">
          <Draggable v-model="preloadedMedias" v-if="preloadedMedias.length">
            <div class="block-thumbnails__title">Image</div>
            <transition-group
              class="addFileCollectionView"
              type="transition"
              name="flip-list"
            >
              <MediaPreview
                v-for="media in preloadedMedias"
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
        <div class="b-check-state_full-width b-check-state_price">
          <div class="btn-post">
            <div>Price</div>
            <div class="price-amount-field getPaidForm__field enabled-tooltip">
              <input
                type="number"
                name="paidPrice"
                placeholder="Enter price"
                class="getPaidAmountPlaceholder"
                v-model="group.price"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>
        <template v-if="group.isPublic">
          <div class="b-check-state_full-width b-check-state-membersView">
            <div class="btn-post">
              <div>Show members</div>
              <div class="form-group form-group_with-label radio-group">
                <!-- <label class="form-group-inner">
                <div class="radio-wrapper icn-item">
                  <input
                    type="radio"
                    name="storyAnswerType"
                    value="all"
                    v-model="group.membersView"
                  />
                  <span class="label">
                    All
                  </span>
                </div>
              </label> -->
                <label class="form-group-inner">
                  <div class="radio-wrapper icn-item">
                    <input
                      type="radio"
                      name="storyAnswerType"
                      value="10"
                      v-model="group.membersViewAmount"
                    />
                    <span class="label">
                      Top 10
                    </span>
                  </div>
                </label>
                <label class="form-group-inner">
                  <div class="radio-wrapper icn-item">
                    <input
                      type="radio"
                      name="storyAnswerType"
                      value="none"
                      v-model="group.membersViewAmount"
                    />
                    <span class="label">
                      None
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div class="b-check-state_full-width b-check-state-subscribersOnly">
            <div class="btn-post">
              <div class="b-check-state b-check-state_post">
                <label>
                  <input
                    class="is-free-post"
                    type="checkbox"
                    v-model="group.forSubscribersOnly"
                  />
                  <span class="b-check-state__icon icn-item icn-size_lg"></span>
                  <span class="b-check-state__text"
                    >Only available to existing subscribers</span
                  >
                </label>
              </div>
            </div>
          </div>
        </template>
        <div class="actions-controls">
          <label
            :class="['add-media-input', { disabled: cantAddMoreMedia }]"
            class="btn-post"
            for="addFile"
          >
            <input
              id="addFile"
              type="file"
              multiple
              :accept="inputAccepts"
              @change="addMediaFiles"
            />
            <span class="icn-media icn-item icn-size_lg"></span>
            <span class="btn-post__text">
              Add media
            </span>
          </label>
          <template v-if="isExtended">
            <div class="btn-post">
              <div class="b-check-state b-check-state_post">
                <label>
                  <input
                    class="is-free-post"
                    type="checkbox"
                    v-model="group.isPublic"
                  />
                  <span class="b-check-state__icon icn-item icn-size_lg"></span>
                  <span class="b-check-state__text">Public</span>
                </label>
              </div>
            </div>
            <div class="btn-post">
              <div class="b-check-state b-check-state_post">
                <label>
                  <input
                    class="is-free-post"
                    type="checkbox"
                    v-model="group.isActive"
                  />
                  <span class="b-check-state__icon icn-item icn-size_lg"></span>
                  <span class="b-check-state__text">Active</span>
                </label>
              </div>
            </div>
          </template>
        </div>
        <button
          type="submit"
          class="btn submit hidden-mobile"
          :disabled="isMediaLoading || notEhoughData"
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
import UserMixin from "@/mixins/user";
import "vue-datetime/dist/vue-datetime.css";
import VueTribute from "vue-tribute";
import UserSuggestions from "@/mixins/userSuggestions";
import FileUpload from "@/mixins/fileUpload";
import MediaPreview from "@/components/common/MediaPreview";
import Draggable from "vuedraggable";
import ConvertTextMixin from "@/mixins/convertText";

const InitialState = {
  expanded: false,
  group: {
    title: "",
    description: "",
    image: "",
    price: "",
    isActive: false,
    isPublic: false,
    membersViewAmount: "none",
    forSubscribersOnly: false
  },
  groupSnapshot: null,
  saving: false,
  defaultPriceLimit: 500,
  dropdownOpened: false,
  allowMultipleFileTypes: false
};

export default {
  name: "EditGroup",
  mixins: [UserMixin, UserSuggestions, FileUpload, ConvertTextMixin],
  data() {
    return {
      ...InitialState
    };
  },
  components: {
    Loader,
    VueTribute,
    MediaPreview,
    Draggable
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
    data: {
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
    isPriceSetLimit() {
      return +this.media.price > 0 && +this.media.price <= 500;
    },
    inputAccepts() {
      return ".jpg, .jpeg, .png";
    },
    allMediaTypes() {
      return ["jpg", "jpeg", "png"];
    },
    isRequiredFieldsFilled() {
      return !!(
        this.group.title.trim().length && this.group.description.trim().length
      );
    },
    cantAddMoreMedia() {
      return this.preloadedMedias.length >= 1;
    },
    notEhoughData() {
      if (this.preloadedMedias.filter(i => !i.processId).length) {
        return true;
      } else if (
        !this.preloadedMedias.length ||
        (!this.group.description.trim() || !this.group.title.trim()) ||
        (this.group.isPublic && !this.group.price.trim())
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    initData() {
      const { description, ...rest } = this.data;
      this.group = rest;
      this.group.description = this.getConvertedText(description);
      this.preloadedMedias = (this.group.media || []).map(media => ({
        alreadySaved: true,
        fileContent: media.thumb && media.thumb.source,
        id: media.id,
        processId: media.id,
        mediaType: media.type,
        preview: media.thumb && media.thumb.source,
        thumbs: media.thumbs,
        thumbId: media.thumbId
      }));
      this.$refs.textarea.value = this.getConvertedText(description);
    },
    clearData() {
      this.group = { ...InitialState.group };
    },
    saveClickHandler() {
      this.saving = true;
      const storeAction = this.type === "create" ? "addGroup" : "updateGroup";
      this.$store
        .dispatch(`profile/groups/${storeAction}`, this.getGroupData(), {
          root: true
        })
        .then(() => {
          this.close();
        })
        .catch(() => {})
        .finally(() => {
          this.saving = false;
        });
    },
    getGroupData() {
      const data = {
        ...this.group,
        mediaFiles: (this.preloadedMedias || []).map(item => ({
          id: item.processId
        })),
        members: this.group.members.map(item => item.id)
      };
      delete data.media;
      delete data.isMember;
      delete data.membersCount;

      return data;
    },
    textInput() {
      this.group.description = this.$refs.textarea.value;
    }
  },
  mounted() {
    if (this.type === "edit") {
      this.initData();
    }
  },
  beforeDestroy() {
    this.clearData();
  },
  directives: {
    ClickOutside
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
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
  .form-group-inner {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  &__label {
    margin-right: 5px;
    .mobile {
      width: 100%;
    }
  }
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
}
.withPadding {
  padding: 0 10px;
}
.b-check-state-membersView {
  margin: 10px 0 15px 0;
  .radio-group {
    display: flex;
    align-items: center;
    padding-right: 0;
    padding-bottom: 0;
    margin-left: 0;
    .form-group-inner {
      margin-left: 22px;
      margin-bottom: 0;
      border-bottom: none;
      .radio-wrapper.icn-item {
        padding-bottom: 0;
      }
    }
  }
}
.b-check-state-subscribersOnly {
  margin-bottom: 10px;
  .b-check-state_post {
    margin-left: 0;
  }
}
</style>
