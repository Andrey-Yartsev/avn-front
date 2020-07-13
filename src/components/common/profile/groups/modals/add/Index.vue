<template>
  <div
    :class="['addPost', { loaderWrap: isSaving, truncated: !user.isPerformer }]"
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
            {{ this.isNew ? "New Group" : "Edit Group" }}
          </h1>
        </button>

        <div class="addPost-header__controls">
          <button
            type="submit"
            class="btn submit sm"
            :disabled="isSaving || notEhoughData"
            @click.prevent="clickHandler"
          >
            {{ isNew ? "Create" : "Save" }}
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
        v-model="title"
        ref="textareaTitle"
        :disabled="isSaving"
      ></textarea>
      <div
        class="text-media-container"
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
            :disabled="isSaving"
          ></textarea>
        </vue-tribute>
        <div
          class="post-attachment"
          v-if="
            (where !== 'modal' || preloadedMedias.length) &&
              $mq === 'desktop' &&
              (isNew || (!isNew && mediaType !== 'audio'))
          "
        >
          <Draggable v-model="preloadedMedias" v-bind="dragOptions">
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
                :isSaving="isSaving"
              />
            </transition-group>
          </Draggable>
        </div>
      </div>
      <div class="actions">
        <div
          v-if="isPublic"
          class="b-check-state_full-width b-check-state_price"
        >
          <div class="btn-post">
            <div>Price</div>
            <div class="price-amount-field getPaidForm__field enabled-tooltip">
              <input
                type="number"
                name="paidPrice"
                placeholder="Enter price"
                class="getPaidAmountPlaceholder"
                v-model="price"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>
        <div
          v-if="isPublic"
          class="b-check-state_full-width b-check-state-membersViewAmount"
        >
          <div class="btn-post">
            <div>Show members</div>
            <div class="form-group form-group_with-label radio-group">
              <label class="form-group-inner">
                <div class="radio-wrapper icn-item">
                  <input
                    type="radio"
                    name="storyAnswerType"
                    value="all"
                    v-model="membersViewAmount"
                  />
                  <span class="label">
                    All
                  </span>
                </div>
              </label>
              <label class="form-group-inner">
                <div class="radio-wrapper icn-item">
                  <input
                    type="radio"
                    name="storyAnswerType"
                    value="5"
                    v-model="membersViewAmount"
                  />
                  <span class="label">
                    Top 5
                  </span>
                </div>
              </label>
              <label class="form-group-inner">
                <div class="radio-wrapper icn-item">
                  <input
                    type="radio"
                    name="storyAnswerType"
                    value="none"
                    v-model="membersViewAmount"
                  />
                  <span class="label">
                    None
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
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
                    v-model="isPublic"
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
                    v-model="isActive"
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
          :disabled="isSaving || notEhoughData"
          @click.prevent="clickHandler"
          v-if="$mq === 'desktop'"
        >
          {{ isNew ? "Create" : "Save" }}
        </button>
      </div>
      <div
        class="post-attachment"
        v-if="
          preloadedMedias.length &&
            $mq === 'mobile' &&
            (isNew || (!isNew && mediaType !== 'audio'))
        "
      >
        <Draggable v-model="preloadedMedias" class="addFileCollectionView">
          <MediaPreview
            v-for="media in preloadedMedias"
            :media="media"
            :key="media.id"
            @removeMedia="removeMedia"
            :isSaving="isSaving"
          />
        </Draggable>
      </div>
      <div class="loader-container loader-container_center" v-if="isSaving">
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
import Draggable from "vuedraggable";
import MediaPreview from "@/components/common/MediaPreview";
import FileUpload from "@/mixins/fileUpload";
import ClickOutside from "vue-click-outside";
import UserMixin from "@/mixins/user";
import VueTribute from "vue-tribute";
import UserSuggestions from "@/mixins/userSuggestions";

const InitialState = {
  expanded: false,
  title: "",
  description: "",
  price: "",
  isPublic: false,
  isActive: false,
  membersViewAmount: "none", // "none" || "all" || "{number}"
  mediaType: "photo",
  isSaving: false,
  limits: {
    video: 1,
    gif: 1,
    photo: 1,
    audio: 1
  }
};

export default {
  name: "AddGroup",
  mixins: [FileUpload, UserMixin, UserSuggestions],
  data() {
    return {
      ...InitialState
    };
  },
  components: {
    Loader,
    MediaPreview,
    Draggable,
    VueTribute
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
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
    isNew() {
      return this.type === "new";
    },
    user() {
      return this.$store.state.auth.user;
    },
    notEhoughData() {
      if (this.preloadedMedias.filter(i => !i.processId).length) {
        return true;
      } else if (
        !this.preloadedMedias.length ||
        (!this.description.trim() || !this.title.trim())
      ) {
        return true;
      } else {
        return false;
      }
    },
    newPost() {
      return this.$store.state.post.newPost;
    },
    // isSaving() {
    //   if (this.$store.state.post.updatePostLoading) {
    //     return true;
    //   }
    //   return this.$store.state.post._createPostLoading;
    // },
    allMediaTypes() {
      const { photo, video, gif, audio } = this.inputAcceptTypes;
      return [...photo, ...video, ...gif, ...audio];
    },
    inputAccepts() {
      const accepts =
        this.mediaType === "all"
          ? this.allMediaTypes
          : this.inputAcceptTypes[this.mediaType];

      return accepts.map(i => `.${i}`).join();
    },
    cantAddMoreMedia() {
      return (
        this.mediaType &&
        this.preloadedMedias.length >= this.limits[this.mediaType]
      );
    },
    isExtended() {
      return (
        this.expanded || this.initialExpanded || this.preloadedMedias.length
      );
    }
  },
  methods: {
    clickHandler() {
      const postData = this.getPostData();
      if (!postData || this.isSaving) return;

      this.isSaving = true;
      this.$store
        .dispatch("profile/groups/addGroup", postData)
        .then(() => {
          this.close();
        })
        .catch(() => {})
        .finally(() => {
          this.isSaving = false;
        });
    },
    reset() {
      this.expanded = InitialState.expanded;
      this.description = InitialState.description;
      this.price = InitialState.price;
      this.isPublic = InitialState.isPublic;
      this.isActive = InitialState.isActive;
      this.mediaType = InitialState.mediaType;
      this.membersViewAmount = InitialState.membersViewAmount;
      this.preloadedMedias = [];
      this.isSaving = false;
    },
    getPostData() {
      if (this.notEhoughData) return;

      const postData = {
        title: this.title,
        description: this.description,
        price: this.price,
        isActive: this.isActive,
        isPublic: this.isPublic,
        membersViewAmount: this.membersViewAmount,
        mediaFiles: this.preloadedMedias.map(media => {
          return {
            id: media.processId
          };
        })
      };

      return postData;
    },

    // user suggestions API
    textInput() {
      this.description = this.$refs.textarea.value;
    },
    getDescription() {
      return this.description;
    },
    getTitle() {
      return this.title;
    },
    getConvertedText() {
      const pattern =
        '<span class="emoji-outer emoji-sizer"><span class="emoji-inner emoji.+?" data-code="(.+?)"></span></span>';
      let description = this.post.description.replace(
        new RegExp(pattern, "ug"),
        (m, unicode) => {
          return unicode;
        }
      );
      description = description.replace(/<br \/>/g, "\n");
      return description.replace(/(<([^>]+)>)/gi, "");
    }
  },
  watch: {
    newPost() {
      this.reset();
    },
    post() {
      if (this.post.id && !this.isNew) {
        if (!this.isOwner(this.post.author.id)) {
          this.$router.push("/");
          return;
        }
        this.title = this.post.title;
        this.description = this.getConvertedText();
        this.price = this.post.price;
        this.isActive = this.post.isActive;
        this.isPublic = this.post.isPublic;
        this.membersViewAmount = this.post.membersViewAmount;
        this.preloadedMedias = (this.post.media || []).map(media => ({
          alreadySaved: true,
          fileContent: media.thumb && media.thumb.source,
          id: media.id,
          processId: media.id,
          mediaType: media.type,
          preview: media.thumb && media.thumb.source,
          thumbs: media.thumbs,
          thumbId: media.thumbId
        }));
        this.mediaType = this.preloadedMedias.length
          ? this.preloadedMedias[0].mediaType
          : "all";

        this.$refs.textareaTitle.innerHTML = this.getTitle();
        this.$refs.textarea.innerHTML = this.getDescription();
      }
    }
  },
  mounted() {
    if (this.$refs.textareaTitle) {
      this.$refs.textareaTitle.focus();
    }

    this.popupItem = this.$el;
    this.$refs.textareaTitle.innerHTML = this.getTitle();
    this.$refs.textarea.innerHTML = this.getDescription();
  },
  directives: {
    ClickOutside
  }
};
</script>

<style lang="scss" scoped>
.text-media-container {
  margin-left: auto;
}
.b-check-state {
  margin-left: 20px;
  label {
    display: flex;
    align-items: center;
  }
}
.b-check-state_price {
  margin-bottom: 5px;
}
.b-check-state-membersViewAmount {
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
</style>
