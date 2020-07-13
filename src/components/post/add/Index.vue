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
      <div
        class="post-scheduled-time"
        v-if="datetime && $mq === 'desktop' && where === 'modal'"
      >
        <div class="datetime-value">
          <span class="post-datetime__value">{{ formattedDate }}</span>
          <span
            @click="resetDatetime"
            class="datetime-value__reset icn-item btn-reset btn-reset_prim-color icn-pos_center"
          />
        </div>
      </div>
      <div class="addPost-header" v-if="$mq === 'mobile'">
        <button
          type="button"
          class="header-return-btn go-back go-back_times"
          @click="close"
        >
          <h1 class="category-name">
            {{ this.isNew ? "New Post" : "Edit Post" }}
          </h1>
        </button>

        <div class="addPost-header__controls">
          <!-- <div
            class="btn-post"
            v-if="hasSubscribePrice && $mq === 'mobile' && isNew"
          >
            <div class="b-check-state b-check-state_post">
              <label>
                <input class="is-free-post" type="checkbox" v-model="isFree" />
                <span class="b-check-state__icon icn-item icn-size_lg"></span>
                <span class="b-check-state__text">Free</span>
              </label>
            </div>
          </div> -->
          <div
            class="tweet-new-post"
            :class="{
              hidden: !user.canSendTweets
            }"
            v-if="$mq === 'mobile' && isNew"
          >
            <input
              class="tweetSend"
              type="checkbox"
              v-model="tweetSend"
              :id="`tweetPost_${where}`"
            />
            <label
              class="icn-item icn-twitter icn-size_lg"
              :for="`tweetPost_${where}`"
            />
          </div>
          <button
            type="submit"
            class="btn submit sm"
            :disabled="notEhoughData || saving"
            @click.prevent="clickHandler"
          >
            {{ isNew ? "Share" : "Save" }}
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
      <div
        class="text-media-container"
        :class="{ 'text-field-border': $mq === 'desktop' }"
      >
        <vue-tribute :options="tributeOptions">
          <textarea
            @focus="() => (expanded = true)"
            class="sm content-editable textarea"
            contenteditable
            placeholder="What's going on?"
            maxlength="1000"
            @input="textInput"
            ref="textarea"
            :disabled="isSaving"
          ></textarea>
        </vue-tribute>
        <LinksPreview :text="postMsg" />
        <div
          class="post-attachment"
          v-if="
            ((datetime && where !== 'modal') || preloadedMedias.length) &&
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
          <div class="block-thumbnails" v-if="showChooseThumbBlock">
            <div class="block-thumbnails__title">Choose cover</div>
            <div class="addFileCollectionView">
              <div
                v-for="thumb in preloadedMedias[0].thumbs"
                :key="thumb.id"
                class="addFileView addFileView_option icn-item"
                :class="{
                  current: preloadedMedias[0].thumbId === thumb.id
                }"
                @click="preloadedMedias[0].thumbId = thumb.id"
              >
                <div class="filename filename_sm">
                  <img :src="thumb.url" />
                </div>
              </div>
            </div>
          </div>
          <div
            class="post-scheduled-time"
            v-if="datetime && $mq === 'desktop' && where !== 'modal'"
          >
            <div class="datetime-value">
              <span
                class="post-datetime__icn icn-item icn-calendar icn-size_lg"
              />
              <span class="post-datetime__value">{{ formattedDate }}</span>
              <span
                @click="resetDatetime"
                class="datetime-value__reset icn-item btn-reset btn-reset_sec-color icn-pos_center"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="actions">
        <div
          class="post-expired-time"
          v-if="datetimeExpired && $mq === 'desktop' && where === 'modal'"
        >
          <div class="datetime-value expired-value">
            <span class="icn-item icn-calendar icn-size_lg" />
            <span class="post-datetime__value">{{ formattedDateExpired }}</span>
            <span
              @click="resetDatetimeExpired"
              class="icn-item btn-reset btn-reset_prim-color icn-pos_center"
            />
          </div>
          <div class="expired-action">
            <label class="form-group-inner">
              <span class="label">Action</span>
              <div class="select-wrapper">
                <select
                  v-model="expiredAction"
                  name="subscriberType"
                  class="default-disabled"
                >
                  <option
                    v-for="option in expiredActionList"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.name }}
                  </option>
                </select>
              </div>
            </label>
          </div>
        </div>
        <div
          class="post-tipsGoal"
          v-if="tipsGoal.isEnabled && $mq === 'desktop' && where === 'modal'"
        >
          <TipsGoalForm
            :tipsGoal="tipsGoal"
            :tipsGoalSourceTypes="tipsGoalSourceTypes"
          />
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
          <div class="btn-post btn-post_datetime" v-if="showSchedule">
            <div class="post-datetime" :class="{ disabled: datetime }">
              <Datetime
                :inputId="`post-datetime__switcher_${where}`"
                class="post-datetime__switcher"
                type="datetime"
                v-model="datetime"
                input-class="post-datetime__input"
                use12-hour
                :min-datetime="minDate"
                :max-datetime="maxDate"
                @close="closeDatepicker"
                :phrases="{ ok: 'Schedule', cancel: 'Cancel' }"
              />
              <span
                class="post-datetime__icn icn-item icn-calendar icn-size_lg"
                @click="openDatepicker"
              ></span>
              <span class="btn-post__text">
                Schedule
              </span>
            </div>
          </div>
          <div class="btn-post btn-post_datetime" v-if="showExpired">
            <div
              class="post-datetime post-datetime-expire"
              :class="{ disabled: datetimeExpired }"
            >
              <Datetime
                :inputId="`post-datetimeExpired__switcher_${where}`"
                class="post-datetime__switcher"
                type="datetime"
                v-model="datetimeExpired"
                input-class="post-datetime__input"
                use12-hour
                :min-datetime="minDateExpired"
                @close="closeDatepickerExpired"
                :phrases="{ ok: 'Expire', cancel: 'Cancel' }"
              />
              <span
                class="post-datetime__icn icn-item icn-calendar icn-size_lg"
                @click="openDatepickerExpired"
              ></span>
              <span class="btn-post__text">
                Expire
              </span>
            </div>
          </div>
          <div
            v-if="user.canEarn && user.canPayoutsRequest"
            class="btn-post btn-post_datetime"
          >
            <div
              class="post-datetime"
              :class="{ disabled: tipsGoal.isEnabled }"
            >
              <span
                class="post-datetime__icn icn-item icn-price icn-size_lg"
                @click="() => (tipsGoal.isEnabled = true)"
              ></span>
              <span class="btn-post__text">
                Tip goal
              </span>
            </div>
          </div>
          <div class="btn-post" v-if="isNew && user.isPerformer">
            <a
              class="b-check-state b-check-state_live"
              :class="{
                disabled: preloadedMedias.length || postMsg.length || datetime
              }"
              @click.prevent="openStream"
            >
              <span
                class="b-check-state__icon icn-live icn-item icn-size_lg"
              ></span>
              <span class="btn-post__text exception">Go live</span></a
            >
          </div>
          <template v-if="isExtended">
            <div class="btn-post" v-if="hasSubscribePrice">
              <div class="b-check-state b-check-state_post">
                <label>
                  <input
                    class="is-free-post"
                    type="checkbox"
                    v-model="isFree"
                  />
                  <span class="b-check-state__icon icn-item icn-size_lg"></span>
                  <span class="b-check-state__text">Free post</span>
                </label>
              </div>
            </div>
          </template>
          <div
            v-if="user.hasWatermarkVideo || user.hasWatermarkPhoto"
            class="b-check-state btn-post b-check-state_watermark"
            :class="{ mediaSelected: preloadedMedias.length > 0 }"
          >
            <label :class="{ disabled: preloadedMedias.length > 0 }">
              <input
                class="is-free-post"
                type="checkbox"
                :disabled="preloadedMedias.length > 0"
                v-model="withoutWatermark"
              />
              <span class="b-check-state__icon icn-item icn-size_lg"></span>
              <span class="b-check-state__text">Without watermark</span>
            </label>
          </div>
        </div>
        <div
          class="tweet-new-post"
          :class="{
            hidden: !user.canSendTweets
          }"
          v-if="$mq === 'desktop' && isNew"
        >
          <input
            class="tweetSend"
            type="checkbox"
            v-model="tweetSend"
            :id="`tweetPost_${where}`"
          />
          <label
            class="icn-item icn-twitter icn-size_lg"
            :for="`tweetPost_${where}`"
          />
        </div>
        <button
          type="submit"
          class="btn submit hidden-mobile"
          :disabled="isSaving || notEhoughData"
          @click.prevent="clickHandler"
          v-if="$mq === 'desktop'"
        >
          {{ isNew ? "Share" : "Save" }}
        </button>
      </div>
      <div
        class="post-attachment"
        v-if="
          (datetime || datetimeExpired || preloadedMedias.length) &&
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
        <div class="block-thumbnails" v-if="showChooseThumbBlock">
          <div class="block-thumbnails__title">Choose cover</div>
          <div class="addFileCollectionView">
            <div
              v-for="thumb in preloadedMedias[0].thumbs"
              :key="thumb.id"
              class="addFileView addFileView_option icn-item"
              :class="{
                current: preloadedMedias[0].thumbId === thumb.id
              }"
              @click="preloadedMedias[0].thumbId = thumb.id"
            >
              <div class="filename filename_sm">
                <img :src="thumb.url" />
              </div>
            </div>
          </div>
        </div>
        <div class="post-scheduled-time" v-if="datetime && $mq === 'mobile'">
          <div class="datetime-value">
            <span class="post-datetime__value">{{ formattedDate }}</span>
            <span
              @click="resetDatetime"
              class="datetime-value__reset icn-item btn-reset btn-reset_prim-color icn-pos_center"
            />
          </div>
        </div>
        <div
          class="post-scheduled-time post-expired-time"
          v-if="datetimeExpired && $mq === 'mobile'"
        >
          <div class="datetime-value">
            <span class="post-datetime__value">{{ formattedDateExpired }}</span>
            <span
              @click="resetDatetimeExpired"
              class="datetime-value__reset icn-item btn-reset btn-reset_prim-color icn-pos_center"
            />
          </div>
          <div class="expired-action">
            <label class="form-group-inner">
              <span class="label">Action</span>
              <div class="select-wrapper">
                <select
                  v-model="expiredAction"
                  name="subscriberType"
                  class="default-disabled"
                >
                  <option
                    v-for="option in expiredActionList"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.name }}
                  </option>
                </select>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div
        class="post-attachment"
        v-if="tipsGoal.isEnabled && $mq === 'mobile'"
      >
        <TipsGoalForm
          :tipsGoal="tipsGoal"
          :tipsGoalSourceTypes="tipsGoalSourceTypes"
        />
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
import { Datetime } from "vue-datetime";
import moment from "moment";
import { Settings, DateTime as LuxonDateTime } from "luxon";
import UserMixin from "@/mixins/user";
import "vue-datetime/dist/vue-datetime.css";
import VueTribute from "vue-tribute";
import UserSuggestions from "@/mixins/userSuggestions";
import LinksPreview from "./linksPreview";
import Multiselect from "vue-multiselect";
import TipsGoalForm from "@/components/post/parts/tipsGoal/TipsGoalForm";

Settings.defaultLocale = "en";

const tipsGoalSourceTypes = [
  { title: "Post tips", value: "localTips" },
  { title: "All other tips", value: "globalTips" },
  { title: "Clips", value: "clips" },
  { title: "Messages", value: "messages" },
  { title: "Subscriptions", value: "subscriptions" },
  { title: "Votes", value: "votes" }
];

const InitialState = {
  expanded: false,
  postMsg: "",
  isFree: false,
  mediaType: "all",
  datetime: undefined,
  datetimeExpired: undefined,
  expiredAction: "delete",
  saving: false,
  withoutWatermark: false,
  limits: {
    video: 1,
    gif: 1,
    photo: 50,
    audio: 1
  },
  tipsGoal: {
    isEnabled: false,
    text: "",
    total: 0,
    achieved: 0,
    sources: []
  },
  tipsGoalSourceTypes: tipsGoalSourceTypes
};

export default {
  name: "AddPost",
  mixins: [FileUpload, UserMixin, UserSuggestions],
  data() {
    return {
      ...InitialState,
      tipsGoal: { ...InitialState.tipsGoal },
      tweetSend: !!this.$store.state.auth.user.twitterNotificationsSettings
        .options.post.isEnabled
    };
  },
  components: {
    Loader,
    MediaPreview,
    Datetime,
    Draggable,
    VueTribute,
    LinksPreview,
    Multiselect,
    TipsGoalForm
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
    isSaving() {
      if (this.$store.state.post.updatePostLoading) {
        return true;
      }
      return this.$store.state.post._createPostLoading;
    },
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
    formattedDate() {
      if (this.$mq === "mobile") {
        return (
          "Post will be scheduled for " +
          moment(this.datetime).format("MMM D, hh:mm a")
        );
      }
      return "Scheduled for " + moment(this.datetime).format("MMM D, hh:mm a");
    },
    formattedDateExpired() {
      return (
        "Expires at " + moment(this.datetimeExpired).format("MMM D, hh:mm a")
      );
    },
    minDate() {
      return LuxonDateTime.local()
        .plus({ minutes: 1 })
        .toISO();
    },
    maxDate() {
      if (!this.datetimeExpired) {
        return null;
      }
      return LuxonDateTime.fromISO(this.datetimeExpired)
        .minus({ minutes: 1 })
        .toISO();
    },
    minDateExpired() {
      if (!this.datetime) {
        return this.minDate;
      }
      return LuxonDateTime.fromISO(this.datetime)
        .plus({ minutes: 1 })
        .toISO();
    },
    isExtended() {
      return (
        this.expanded ||
        this.initialExpanded ||
        this.preloadedMedias.length ||
        this.datetime
      );
    },
    showChooseThumbBlock() {
      const pm = this.preloadedMedias;
      return (
        pm &&
        pm.length &&
        (pm[0].mediaType === "video" || pm[0].type === "video") &&
        pm[0].thumbs &&
        pm[0].thumbs.length
      );
    },
    showSchedule() {
      if (this.post && this.post.isActive) {
        return false;
      }
      return this.user.isPerformer;
    },
    showExpired() {
      return this.isMonetizedUser;
    },
    expiredActionList() {
      const list = [
        { name: "Delete", value: "delete" },
        { name: "Hide", value: "hide" }
      ];
      if (this.isFree) {
        list.push({
          name: "For subscribers only",
          value: "makeSubscribersOnly"
        });
      }
      return list;
    },
    validTipsData() {
      return (
        this.tipsGoal.isEnabled &&
        this.tipsGoal.text.trim().length &&
        parseFloat(this.tipsGoal.total) > 0 &&
        this.tipsGoal.sources.length
      );
    }
  },
  methods: {
    clickHandler() {
      const postData = this.getPostData();
      if (!postData || this.saving) return;

      if (this.isNew) {
        this.$store.dispatch("post/createPost", postData);
      } else {
        this.$store.dispatch("post/updatePost", {
          postId: this.post.id,
          data: postData
        });
      }
      this.saving = true;
    },
    resetDatetime() {
      this.datetime = InitialState.datetime;
    },
    resetDatetimeExpired() {
      this.datetimeExpired = InitialState.datetimeExpired;
      this.expiredAction = InitialState.expiredAction;
    },
    reset() {
      this.expanded = InitialState.expanded;
      this.tweetSend = !!this.$store.state.auth.user
        .twitterNotificationsSettings.options.post.isEnabled;
      this.postMsg = InitialState.postMsg;
      this.isFree = InitialState.isFree;
      this.mediaType = InitialState.mediaType;
      this.preloadedMedias = [];
      this.datetime = InitialState.datetime;
      this.datetimeExpired = InitialState.datetimeExpired;
      this.expiredAction = InitialState.expiredAction;
      this.saving = false;
      this.tipsGoal = { ...InitialState.tipsGoal };
    },
    getPostData() {
      if (this.notEhoughData) return;

      const scheduledDate = moment(this.datetime)
        .utc()
        .format("Y-MM-DD HH:mm:ss");

      const expiredDate = moment(this.datetimeExpired)
        .utc()
        .format("Y-MM-DD HH:mm:ss");

      const postData = {
        text: this.postMsg,
        tweetSend: this.tweetSend,
        isScheduled: !!this.datetime,
        isFree: this.isFree,
        mediaFiles: this.preloadedMedias.map(media => {
          const data = {};

          if (media.mediaType === "video") {
            data.thumbId = media.thumbId;
          }

          return {
            id: media.processId,
            ...data
          };
        })
      };

      if (postData.isScheduled) {
        postData.scheduledDate = scheduledDate;
      }

      if (this.datetimeExpired) {
        postData.expiredDate = expiredDate;
        postData.expiredAction = this.expiredAction;
      } else if (!this.datetimeExpired && this.post.expiredDate) {
        postData.expiredDate = "";
      }

      if (this.validTipsData) {
        postData.tipsGoal = {
          ...this.tipsGoal,
          total: parseFloat(this.tipsGoal.total),
          sources: this.tipsGoal.sources.map(item => item.value)
        };
      } else if (
        this.post.tipsGoal &&
        this.post.tipsGoal.isEnabled &&
        !this.tipsGoal.isEnabled
      ) {
        postData.tipsGoal = {
          ...InitialState.tipsGoal
        };
      }

      return postData;
    },
    openDatepicker() {
      if (this.datetime) return;
      document.body.classList.add("open-timepicker");
      document.getElementById(`post-datetime__switcher_${this.where}`).click();
    },
    openDatepickerExpired() {
      if (this.datetimeExpired) return;
      document.body.classList.add("open-timepicker");
      document
        .getElementById(`post-datetimeExpired__switcher_${this.where}`)
        .click();
    },
    closeDatepicker() {
      document.body.classList.remove("open-timepicker");
    },
    closeDatepickerExpired() {
      document.body.classList.remove("open-timepicker");
    },

    // user suggestions API
    textInput() {
      this.postMsg = this.$refs.textarea.value;
    },
    getText() {
      return this.postMsg;
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
    openStream() {
      // console.log(preloadedMedias.length, postMsg.length, datetime)
      if (this.preloadedMedias.length || this.postMsg.length || this.datetime)
        return;
      // Detects if device is on iOS
      const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(userAgent);
      };
      // Detects if device is in standalone mode
      const isInStandaloneMode = () =>
        "standalone" in window.navigator && window.navigator.standalone;

      // Checks if should display install popup notification:
      if (isIos()) {
        if (isInStandaloneMode()) {
          this.openStreamNewWin();
          return;
        }
      }

      this.$router.push("/stream");
    },
    openStreamNewWin() {
      const a = document.createElement("a");
      a.setAttribute(
        "href",
        "/stream?auth_token=" + this.$store.state.auth.token
      );
      a.setAttribute("target", "_blank");

      const dispatch = document.createEvent("HTMLEvents");
      dispatch.initEvent("click", true, true);
      a.dispatchEvent(dispatch);
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

        this.datetime = this.post.scheduledDate;
        this.datetimeExpired = this.post.expiredDate;
        this.expiredAction =
          this.post.expiredAction || InitialState.expiredAction;
        this.postMsg = this.getConvertedText();
        this.tweetSend = this.post.tweetSend;
        this.isFree = this.post.isFree;
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
        this.tipsGoal =
          this.post.tipsGoal && this.post.tipsGoal.isEnabled
            ? {
                ...this.post.tipsGoal,
                sources: tipsGoalSourceTypes.filter(item =>
                  this.post.tipsGoal.sources.includes(item.value)
                )
              }
            : Object.assign({}, InitialState.tipsGoal);

        this.$refs.textarea.innerHTML = this.getText();
      }
    },
    isFree(value, oldValue) {
      if (!value && oldValue && this.expiredAction === "makeSubscribersOnly") {
        this.expiredAction = "delete";
      }
    }
  },
  mounted() {
    if (this.$refs.textarea) {
      this.$refs.textarea.focus();
    }

    this.popupItem = this.$el;
    this.$refs.textarea.innerHTML = this.getText();
  },
  beforeDestroy() {
    this.tipsGoal = { ...InitialState.tipsGoal };
  },
  directives: {
    ClickOutside
  }
};
</script>
