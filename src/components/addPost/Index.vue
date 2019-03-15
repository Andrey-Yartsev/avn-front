<template>
  <div
    :class="['addPost', { loaderWrap: isSaving }]"
    v-click-outside="() => (expanded = false)"
  >
    <form
      :class="[
        'add-new-form bg-gradient_light-desk bg-gradient_light',
        { expanded: expanded || initialExpanded || preloadedMedias.length }
      ]"
    >
      <div class="addPost-header">
        <button
          type="button"
          class="header-return-btn go-back go-back_times"
          @click="close"
        >
          <h1 class="category-name">New Post</h1>
        </button>
        <button
          type="submit"
          class="btn submit sm"
          :disabled="notEhoughData"
          @click="addNewPost"
        >
          Share
        </button>
      </div>
      <span
        class="avatar avatar_not-shadow avatar_gap-r-md avatar_sm hidden-mobile"
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
        <VuePerfectScrollbar class="addFileCollectionView">
          <MediaPreview
            v-for="media in preloadedMedias"
            :media="media"
            :key="media.id"
            @removeMedia="removeMedia"
            :isSaving="isSaving"
          />
        </VuePerfectScrollbar>
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
          <div class="post-datetime" :class="{ active: datetime }">
            <Datetime
              input-id="post-datetime__switcher"
              class="post-datetime__switcher"
              type="datetime"
              v-model="datetime"
              input-class="post-datetime__input"
              use12-hour
              :min-datetime="minDate"
              @close="closeDatepicker"
            />
            <span class="post-datetime__btn" @click="openDatepicker"></span>
            <span class="post-datetime__value" v-if="datetime">{{
              formattedDate
            }}</span>
            <span
              @click="resetDatetime"
              class="post-datetime__reset"
              v-if="datetime"
            />
          </div>
          <router-link
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
        <label :class="['tweet-new-post', { hidden: !user.isAllowTweets }]">
          <input class="tweetSend" type="checkbox" :checked="tweetSend" />
          <span class="icon" @click="tweetSend = !tweetSend"></span>
        </label>
        <button
          type="submit"
          class="btn submit hidden-mobile"
          :disabled="notEhoughData"
          @click="addNewPost"
        >
          Share
        </button>
      </div>
    </form>
    <Loader v-if="isSaving" :fullscreen="false" class="small"></Loader>
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
  tweetSend: false,
  postMsg: "",
  isSaving: false,
  isFree: false,
  mediaType: "all",
  datetime: undefined
};

export default {
  name: "AddPost",
  mixins: [FileUpload],
  data: () => ({
    ...InitialState
  }),
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
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    hasSubscribePrice() {
      return this.$store.state.auth.user.subscribePrice > 0;
    },
    notEhoughData() {
      if (this.preloadedMedias.length) {
        return false;
      }
      if (!this.postMsg.trim()) {
        return true;
      }
      return false;
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
    resetDatetime() {
      this.datetime = InitialState.datetime;
    },
    reset() {
      this.expanded = InitialState.expanded;
      this.tweetSend = InitialState.tweetSend;
      this.postMsg = InitialState.postMsg;
      this.isSaving = InitialState.isSaving;
      this.isFree = InitialState.isFree;
      this.mediaType = InitialState.mediaType;
      this.preloadedMedias = [];
      this.datetime = InitialState.datetime;
    },
    addNewPost: async function(e) {
      e.preventDefault();

      if (this.notEhoughData) return;

      this.isSaving = true;

      const mediaFiles = await this.getMediaFiles();
      const scheduledDate = moment(this.datetime)
        .utc()
        .format("Y-MM-DD HH:mm:ss");

      const newPostData = {
        text: this.postMsg,
        tweetSend: this.tweetSend,
        isScheduled: !!this.datetime,
        scheduledDate,
        mediaFiles
      };

      if (this.hasSubscribePrice) {
        newPostData.isFree = this.isFree;
      }

      this.$store.dispatch("post/savePost", newPostData);
    },
    toast(text) {
      this.$store.dispatch("global/flashToast", text, { root: true });
    },
    openDatepicker() {
      document.body.classList.add("open-timepicker");
      document.getElementById("post-datetime__switcher").click();
    },
    closeDatepicker() {
      document.body.classList.remove("open-timepicker");
    }
  },
  watch: {
    newPost() {
      this.reset();
      this.$router.push("/");
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
