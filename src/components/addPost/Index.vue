<template>
  <div
    :class="['addPost', { loaderWrap: isSaving, truncated: !user.isPerformer }]"
    v-click-outside="() => (expanded = false)"
  >
    <form
      :class="[
        'add-new-form bg-gradient_light-desk bg-gradient_light',
        {
          expanded:
            expanded || initialExpanded || preloadedMedias.length || datetime
        }
      ]"
    >
      <div class="addPost-header">
        <button
          type="button"
          class="header-return-btn go-back go-back_times"
          @click="close"
        >
          <h1 class="category-name">
            {{ this.isNew ? "New Post" : "Edit Post" }}
          </h1>
        </button>
        <button
          type="submit"
          class="btn submit sm"
          :disabled="notEhoughData"
          @click.prevent="clickHandler"
        >
          {{ this.isNew ? "Share" : "Save" }}
        </button>
      </div>
      <span
        class="avatar avatar_not-shadow avatar_gap-r-md avatar_sm hidden-mobile"
        v-if="$mq === 'desktop'"
      >
        <span class="avatar__img">
          <img v-if="user.avatar" :src="user.avatar" />
        </span>
      </span>
      <div class="text-media-container">
        <textarea
          @focus="() => (expanded = true)"
          class="sm"
          placeholder="What is going on?"
          maxlength="1000"
          v-model="postMsg"
        ></textarea>
        <div
          class="post-attachment"
          v-if="(datetime || preloadedMedias.length) && $mq === 'desktop'"
        >
          <VuePerfectScrollbar class="addFileCollectionView">
            <MediaPreview
              v-for="media in preloadedMedias"
              :media="media"
              :key="media.id"
              @removeMedia="removeMedia"
              :isSaving="isSaving"
            />
          </VuePerfectScrollbar>
          <div class="post-scheduled-time" v-if="datetime">
            <div class="datetime-value">
              <span class="post-datetime__value">{{ formattedDate }}</span>
              <span @click="resetDatetime" class="datetime-value__reset" />
            </div>
          </div>
        </div>
      </div>
      <div class="actions">
        <div class="actions-controls">
          <label :class="['add-media-input', { disabled: cantAddMoreMedia }]">
            <input
              type="file"
              multiple
              :accept="inputAccepts"
              @change="addMediaFiles"
            />
          </label>
          <template v-if="hasSubscribePrice">
            <div class="b-check-state b-check-state_post">
              <label>
                <input class="is-free-post" type="checkbox" v-model="isFree" />
                <span class="b-check-state__icon"></span>
                <span class="b-check-state__text">Free post</span>
              </label>
            </div>
          </template>
          <div
            v-if="user.isPerformer"
            class="post-datetime"
            :class="{ disabled: datetime }"
          >
            <Datetime
              :inputId="`post-datetime__switcher_${where}`"
              class="post-datetime__switcher"
              type="datetime"
              v-model="datetime"
              input-class="post-datetime__input"
              use12-hour
              :min-datetime="minDate"
              @close="closeDatepicker"
              :phrases="{ ok: 'Schedule', cancel: 'Cancel' }"
            />
            <span class="post-datetime__btn" @click="openDatepicker"></span>
          </div>
          <router-link
            v-if="isNew && user.isPerformer"
            class="b-check-state b-check-state_live"
            :class="{
              disabled: preloadedMedias.length || postMsg.length || datetime
            }"
            to="/stream"
            >Go live</router-link
          >
        </div>
        <div class="add-new-type add-new-type_underline-items line-top">
          <AddNewNav active="post" />
        </div>
        <div
          class="tweet-new-post"
          :class="{
            hidden: !user.canSendTweets
          }"
        >
          <input
            class="tweetSend"
            type="checkbox"
            v-model="tweetSend"
            :id="`tweetPost_${where}`"
          />
          <label class="icon" :for="`tweetPost_${where}`" />
        </div>
        <button
          type="submit"
          class="btn submit hidden-mobile"
          :disabled="notEhoughData"
          @click.prevent="clickHandler"
          v-if="$mq === 'desktop'"
        >
          {{ this.isNew ? "Share" : "Save" }}
        </button>
      </div>
      <div
        class="post-attachment"
        v-if="(datetime || preloadedMedias.length) && $mq === 'mobile'"
      >
        <div class="addFileCollectionView">
          <MediaPreview
            v-for="media in preloadedMedias"
            :media="media"
            :key="media.id"
            @removeMedia="removeMedia"
            :isSaving="isSaving"
          />
        </div>
        <div class="post-scheduled-time" v-if="datetime">
          <div class="datetime-value">
            <span class="post-datetime__value">{{ formattedDate }}</span>
            <span @click="resetDatetime" class="datetime-value__reset" />
          </div>
        </div>
      </div>
    </form>
    <Loader v-if="isSaving" :fullscreen="false" class="small" />
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Loader from "@/components/common/Loader";
import MediaPreview from "@/components/common/MediaPreview";
import FileUpload from "@/mixins/fileUpload";
import AddNewNav from "@/components/addNewNav/Index";
import ClickOutside from "vue-click-outside";
import { Datetime } from "vue-datetime";
import moment from "moment";
import { Settings, DateTime as LuxonDateTime } from "luxon";
import "vue-datetime/dist/vue-datetime.css";

Settings.defaultLocale = "en";

const InitialState = {
  expanded: false,
  postMsg: "",
  isSaving: false,
  isFree: false,
  mediaType: "all",
  datetime: undefined
};

export default {
  name: "AddPost",
  mixins: [FileUpload],
  data() {
    return {
      ...InitialState,
      tweetSend: !!this.$store.state.auth.user.isPostsTweets
    };
  },
  components: {
    Loader,
    MediaPreview,
    AddNewNav,
    VuePerfectScrollbar,
    Datetime
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
    isNew() {
      return this.type === "new";
    },
    user() {
      return this.$store.state.auth.user;
    },
    hasSubscribePrice() {
      return this.$store.state.auth.user.subscribePrice > 0;
    },
    notEhoughData() {
      if (this.preloadedMedias.filter(i => !i.processId).length) {
        return true;
      } else if (!this.preloadedMedias.length && !this.postMsg.trim()) {
        return true;
      } else {
        return false;
      }
    },
    newPost() {
      return this.$store.state.post.newPost;
    },
    allMediaTypes() {
      const { photo, video, gif } = this.inputAcceptTypes;
      return [...photo, ...video, ...gif];
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
    formattedDate() {
      return "Scheduled for " + moment(this.datetime).format("MMM D, hh:mm a");
    },
    minDate() {
      return LuxonDateTime.local().toISO();
    }
  },
  methods: {
    clickHandler() {
      const postData = this.getPostData();
      if (!postData) return;

      if (this.isNew) {
        this.$store.dispatch("post/savePost", postData);
      } else {
        this.$store.dispatch("post/updatePostData", {
          postId: this.post.id,
          data: postData
        });
      }
    },
    resetDatetime() {
      this.datetime = InitialState.datetime;
    },
    reset() {
      this.expanded = InitialState.expanded;
      this.tweetSend = !!this.$store.state.auth.user.isPostsTweets;
      this.postMsg = InitialState.postMsg;
      this.isSaving = InitialState.isSaving;
      this.isFree = InitialState.isFree;
      this.mediaType = InitialState.mediaType;
      this.preloadedMedias = [];
      this.datetime = InitialState.datetime;
    },
    getPostData() {
      if (this.notEhoughData) return;

      this.isSaving = true;

      const scheduledDate = moment(this.datetime)
        .utc()
        .format("Y-MM-DD HH:mm:ss");

      const postData = {
        text: this.postMsg,
        tweetSend: this.tweetSend,
        isScheduled: !!this.datetime,
        mediaFiles: this.preloadedMedias.map(i => i.processId)
      };

      if (postData.isScheduled) {
        postData.scheduledDate = scheduledDate;
      }

      if (this.hasSubscribePrice) {
        postData.isFree = this.isFree;
      }

      return postData;
    },
    toast(text) {
      this.$store.dispatch("global/flashToast", text, { root: true });
    },
    openDatepicker() {
      if (this.datetime) return;
      document.body.classList.add("open-timepicker");
      document.getElementById(`post-datetime__switcher_${this.where}`).click();
    },
    closeDatepicker() {
      document.body.classList.remove("open-timepicker");
    }
  },
  watch: {
    newPost() {
      this.reset();
      this.$router.push("/");
    },
    post() {
      if (this.post.id && !this.isNew) {
        this.datetime = this.post.scheduledDate;
        this.postMsg = this.post.text;
        this.tweetSend = this.post.tweetSend;
        this.isFree = this.post.isFree;
        this.preloadedMedias = (this.post.media || []).map(media => ({
          alreadySaved: true,
          fileContent: media.thumb.source,
          id: media.id,
          processId: media.id,
          mediaType: media.type,
          preview: media.thumb.source
        }));
        this.mediaType = this.preloadedMedias.length
          ? this.preloadedMedias[0].mediaType
          : "all";
      }
    }
  },
  mounted() {
    this.popupItem = this.$el;
  },
  directives: {
    ClickOutside
  }
};
</script>
