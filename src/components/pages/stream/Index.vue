<template>
  <div
    class="stream-container"
    :class="{ stream_enabled: isStarted, stream_stop: isStopped }"
  >
    <div class="loader-container loader-container_center" v-if="!user">
      <Loader :fullscreen="false" text="" :small="true" />
    </div>
    <div class="stream " v-else>
      <div class="mediasTop">
        <div
          class="mediasTop__header stream-header"
          :class="{ 'mediasTop__header-underlined': !isStarted }"
        >
          <span
            class="category-name category-name_live hidden-mobile"
            @click="close"
            v-if="$mq === 'mobile'"
            >Live video</span
          >
          <button
            class="close close_light close_visible-mob icn-item icn-size_lg"
            @click="close"
          >
            <span
              class="category-name category-name_live hidden-desktop"
              v-if="$mq === 'mobile'"
              >Live Video</span
            >
          </button>
          <div class="mediasHeaderControls" v-if="isStarted">
            <NotificationsMenu />
            <button id="stop" class="btn alt sm top" @click="close">
              Stop
            </button>
          </div>
          <div class="group-controls">
            <div id="devices">
              <div
                v-click-outside="hideStreamVisibilityMenu"
                :class="[
                  'btn-media-event has-dropdown stream-visibility',
                  streamVisibility.key,
                  {
                    shown: shownStreamVisibilityMenu
                  }
                ]"
                v-if="user"
              >
                <button
                  type="button"
                  class="root-btn"
                  @click="showStreamVisibilityMenu"
                >
                  <span class="root-btn__inside">{{
                    streamVisibility.label
                  }}</span>
                </button>
                <div
                  class="menu-overlay"
                  @click="hideStreamVisibilityMenu"
                ></div>
                <div class="menu">
                  <button
                    type="button"
                    v-for="streamVisib in streamVisibilities"
                    v-bind:key="streamVisib.key"
                    :class="[
                      'item',
                      { active: streamVisibility.key === streamVisib.key }
                    ]"
                    @click="() => setStreamVisibility(streamVisib)"
                    :disabled="streamVisib.disabled"
                  >
                    <span class="value">{{ streamVisib.label }}</span>
                  </button>
                </div>
              </div>

              <div
                v-if="
                  $mq === 'mobile' && streamVideos && streamVideos.length > 1
                "
                class="btn-media-event camera-switcher"
                @click="toggleCamera"
              >
                <button type="button" class="root-btn">
                  <div class="root-btn__inside"></div>
                </button>
              </div>

              <VideosMenu
                v-if="streamAudio"
                :streamVideo="streamVideo"
                :streamVideos="streamVideos"
                @setStreamVideo="setStreamVideo"
              />
              <AudiosMenu
                v-if="streamAudio"
                :streamAudio="streamAudio"
                :streamAudios="streamAudios"
                @setStreamAudio="setStreamAudio"
              />
              <NotificationsMenu />
            </div>
          </div>
        </div>
      </div>
      <div id="videos">
        <div
          id="videowrap"
          class="stream-video-container"
          :class="{ 'mirror-reflection': isMirror }"
        >
          <div class="likesContainer">
            <div
              v-for="like in likes"
              :id="like.date"
              :key="like.date"
              class="like"
              :style="{ top: `${like.y}px`, left: `${like.x}px` }"
            >
              <div class="like-icon">
                <div class="like-icon__symbol icn-item" />
              </div>
            </div>
          </div>
          <video
            class="rounded centered"
            id="myvideo"
            autoplay=""
            muted=""
            playsinline=""
            v-if="!isStopped"
            @contextmenu.prevent="() => false"
            @dragstart.prevent="() => false"
          />
        </div>
        <div id="stream-timer" v-if="!isStopped && !startingStream">
          {{ time }}
        </div>
        <div class="stream-online-label" v-if="isStarted && !startingStream">
          live
        </div>
        <div
          class="stream-tipsGoalTitle"
          v-if="activeTipsGoal.amount && activeTipsGoal.description"
        >
          TIP Countdown: ${{ activeTipsGoal.amount.toFixed(2) }} for
          {{ activeTipsGoal.description }}
        </div>
        <div class="stream-forms" v-if="isStarted">
          <div class="form-comments">
            <Comments
              v-if="asideType === 'comments'"
              :shownComments="comments"
              :count="comments.length"
              :class="{ 'm-with-amount-form': showTipsGoalForm }"
            />
            <StreamViewers
              v-else
              :type="asideType"
              :block="showBlockUserConfirm"
              :kick="showKickUserConfirm"
            />
            <form
              class="form-comments__wrapper"
              v-if="asideType === 'comments'"
            >
              <textarea
                ref="commentInput"
                placeholder="Comment"
                class="form-comments__input rounded lg"
                maxlength="200"
                :minHeight="20"
                :maxHeight="85"
                v-model="newComment"
                @keypress.enter.prevent="sendComment"
              />
              <button
                @click="sendComment"
                type="button"
                class="btn-send btn-send_inside-field icn-item icn-size_lg"
                :disabled="!newComment.length"
              ></button>
            </form>
          </div>
          <div class="form-tipsGoal" v-if="showTipsGoalForm">
            <form class="form-tipsGoal__wrapper">
              <p class="form-tipsGoal__title">Amount:</p>
              <input
                type="number"
                ref="tipsGoalAmmount"
                class="form-comments__input m-amount rounded lg"
                min="0"
                v-model.trim="tipsGoal.amount"
                @keypress.enter.prevent="sendTipGoal"
              />
              <input
                ref="tipsGoalDescription"
                placeholder="Description"
                class="form-comments__input m-description rounded lg"
                maxlength="200"
                v-model.trim="tipsGoal.description"
                @keypress.enter.prevent="sendTipGoal"
              />
              <button
                @click="sendTipGoal"
                type="button"
                class="btn-send btn-send_inside-field icn-item icn-size_lg"
                :disabled="!tipsGoal.amount || !tipsGoal.description"
              ></button>
            </form>
            <div class="form-group-inner form-tipsGoal__sources">
              <span class="label" :class="{ mobile: $mq === 'mobile' }"
                >Sources:</span
              >
              <span class="form-group form-group_clear-gaps">
                <span class="form-field">
                  <multiselect
                    v-model="tipsGoal.sources"
                    :options="tipsGoal.sourceTypes"
                    :multiple="true"
                    :close-on-select="true"
                    :clear-on-select="false"
                    :preserve-search="true"
                    placeholder="Add source"
                    label="title"
                    track-by="value"
                  >
                    <template
                      slot="selection"
                      slot-scope="{ values, search, isOpen }"
                      ><span
                        class="multiselect__single"
                        v-if="tipsGoal.sources.length &amp;&amp; !isOpen"
                        >{{ tipsGoal.sources.length }} sources selected</span
                      ></template
                    >
                  </multiselect>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="bottom-btns">
          <span
            role="button"
            class="bottom-btn"
            :class="{ selected: asideType === 'comments' }"
            @click="asideType = 'comments'"
          >
            <span
              class="btn-icon comments icn-item icn-size_lg"
              v-tooltip="'Comments'"
            />
          </span>
          <span
            class="bottom-btn"
            :class="{ selected: asideType === 'like', disabled: !likesCount }"
            ref="likeBtn"
            @click="asideType = 'like'"
          >
            <span
              class="btn-icon likes icn-item icn-size_lg"
              v-tooltip="'Likes'"
            />
            {{ likesCount ? likesCount : "" }}
          </span>
          <span
            class="stream-btn bottom-btn"
            @click="asideType = 'tip'"
            :class="{ selected: asideType === 'tip', disabled: !amount }"
          >
            <span
              class="btn-icon icn-tips icn-item icn-size_lg"
              v-tooltip="'Tips'"
            />
            {{ amount.toFixed(2) }}
          </span>
          <span
            class="stream-online-count bottom-btn"
            @click="asideType = 'view'"
            :class="{ selected: asideType === 'view', disabled: !looksCount }"
          >
            <span
              class="looking btn-icon icn-item icn-size_lg"
              v-tooltip="'Viewers'"
            />
            {{ looksCount }}
          </span>
          <span
            class="stream-online-count bottom-btn"
            @click="toggleTipGoalForm"
            :class="{ selected: true }"
          >
            <span
              class="btn-icon icn-item icn-size_lg icn-price has-tooltip"
              v-tooltip="'Set tips goal'"
            />
          </span>
        </div>
        <Filters
          v-if="filters.length"
          :filters="filters"
          :onChange="changeFilter"
        />
      </div>
      <div class="mediasBottom" v-if="isReadyToStart">
        <button
          class="btn alt lg block change-devices btn-center btn_fix-width-lg btn_not-bold btn_white btn_white-alfabg"
          @click="tryToStartStream"
        >
          Start live video
        </button>
      </div>
    </div>
    <Loader
      text="Starting the stream"
      class="text-light"
      :semidark="true"
      v-if="startingStream"
    />
    <StreamStatistic
      :close="
        (haveToSave, haveToSaveComments) =>
          close({}, haveToSave, haveToSaveComments)
      "
      :duration="time"
      :streamDuration="streamDuration"
      :streamStartTime="streamStartTime"
      v-if="isStopped && isStoppedByButton"
      :canBeSaved="canBeSaved"
      :loading="finishing"
      :saving="saving"
    />
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import StreamStatistic from "@/components/pages/stream/Statistic";
import Filters from "@/components/pages/stream/Filters";
import userMixin from "@/mixins/user";
import { StreamModule } from "streaming-module";
import StreamApi from "@/api/stream";
import ClickOutside from "vue-click-outside";
import logoBase64 from "@/components/pages/stream/utils/logo";
import Comments from "@/components/common/streamComments/Index";
import StreamViewers from "@/components/pages/stream/Viewers";
import { getCookie } from "@/components/pages/stream/utils/debug";
import { intervalToDuration } from "date-fns";
import LoadScriptsMixin from "@/components/statistics/mixins/loadScripts";
import { convertImgToBase64URL } from "@/utils/mediaFiles";
import Multiselect from "vue-multiselect";
import NotificationsMenu from "./menu/Notifications";
import AudiosMenu from "./menu/AudiosMenu";
import VideosMenu from "./menu/VideosMenu";
import BrowserStore from "store";

const tipsGoalSourceTypes = [
  { title: "Live stream tips", value: "localTips" },
  { title: "All other tips", value: "globalTips" },
  { title: "Clips", value: "clips" },
  { title: "Messages", value: "messages" },
  { title: "Subscriptions", value: "subscriptions" },
  { title: "Votes", value: "votes" }
];

export default {
  name: "Stream",
  directives: {
    ClickOutside
  },
  mixins: [userMixin, LoadScriptsMixin],
  components: {
    Loader,
    StreamStatistic,
    Filters,
    Comments,
    StreamViewers,
    Multiselect,
    NotificationsMenu,
    AudiosMenu,
    VideosMenu
  },
  data() {
    return {
      streamVisibility: {},
      shownStreamVisibilityMenu: false,

      streamVideos: undefined,
      streamVideo: undefined,
      shownStreamVideoMenu: false,

      streamAudios: undefined,
      streamAudio: undefined,

      isReadyToStart: false,
      isStarted: false,
      isStopped: false,
      isStoppedByButton: false,
      saving: false,
      startingStream: false,
      isMirror: false,
      time: undefined,
      startedStreamId: undefined,
      likes: [],
      newComment: "",
      looksCount: 0,
      canBeSaved: false,

      streamDuration: 0,
      streamStartTime: 0,

      filters: [],

      shownComments: [],

      finishing: false,

      asideType: "comments",

      tipsGoal: {
        amount: "",
        description: "",
        sources: [],
        sourceTypes: tipsGoalSourceTypes
      },
      showTipsGoalForm: false,
      base64watermark: null
      // tipsGoalSources: [],
      // tipsGoalSourceTypes: tipsGoalSourceTypes
    };
  },
  computed: {
    likesCount() {
      return this.$store.state.lives.currentLive.likesCount;
    },
    amount() {
      return this.$store.state.lives.currentLive.amount;
    },
    comments() {
      return this.$store.state.lives.currentLive.comments;
    },
    streamVisibilities() {
      const list = [
        {
          key: "subscribers",
          label: "Subscribers only",
          disabled:
            !this.canEarn ||
            !this.user.isWantEarn ||
            this.user.subscribePrice <= 0
        },
        {
          key: "followers",
          label: "Followers only",
          disabled: false
        },
        {
          key: "public",
          label: "Everyone",
          disabled: false
        }
      ];
      if (this.user.streamGroups?.length) {
        this.user.streamGroups.forEach(item => {
          list.push({
            key: item.key,
            label: item.label,
            disabled: false
          });
        });
      }
      return list;
    },
    activeTipsGoal() {
      return this.$store.state.lives.currentLive.tipsGoal;
    },
    isTipsGoalExists() {
      return this.activeTipsGoal.description && this.activeTipsGoal.amount;
    },
    newLook() {
      return this.$store.state.lives.currentLive.newLook;
    },
    newTip() {
      return this.$store.state.lives.currentLive.newTip;
    },
    goalAchieved() {
      return this.$store.state.lives.currentLive.goalAchieved;
    }
  },
  methods: {
    showStreamVisibilityMenu() {
      this.shownStreamVisibilityMenu = true;
    },
    hideStreamVisibilityMenu() {
      this.shownStreamVisibilityMenu = false;
    },
    setStreamVisibility(value) {
      this.streamVisibility = value;
      this.shownStreamVisibilityMenu = false;
    },
    showStreamVideoMenu() {
      this.shownStreamVideoMenu = true;
    },
    hideStreamVideoMenu() {
      this.shownStreamVideoMenu = false;
    },
    setStreamVideo(value) {
      this.streamModule.switchDevices(false, value.deviceId);
      this.streamVideo = value;
      BrowserStore.set("streamVideo", value.label);
      setTimeout(() => {
        this.isMirror =
          this.streamModule.cameraFacingMode === "user" &&
          this.streamModule.isMobile;
      }, 333);
    },
    toggleCamera() {
      const currentDevice = this.streamVideos.find(
        device => device.deviceId === this.streamModule.videoVars.device.id
      );

      let camIndex = this.streamVideos.indexOf(currentDevice);
      camIndex = camIndex >= this.streamVideos.length - 1 ? 0 : camIndex + 1;

      const newVideoDevice = this.streamVideos[camIndex];
      this.setStreamVideo(newVideoDevice);
    },
    setStreamAudio(value) {
      this.streamModule.switchDevices(value.deviceId, false);
      this.streamAudio = value;
      if (!value.deviceId) {
        BrowserStore.set("streamAudio", "");
      } else {
        BrowserStore.set("streamAudio", value.label);
      }
    },
    onDevicesReadyCallback() {
      const {
        audioDevices,
        /* defaultAudioDevice, */
        videoDevices,
        defaultVideoDevice
      } = this.streamModule.getDevices();

      this.isReadyToStart = true;

      this.streamVideos = videoDevices;
      this.streamVideo = defaultVideoDevice;

      this.initAudios(audioDevices);

      setTimeout(() => {
        this.isMirror =
          this.streamModule.cameraFacingMode === "user" &&
          this.streamModule.isMobile;
      }, 333);
    },
    tick() {
      const _currentTime = Math.round(new Date().getTime() / 1000);

      if (!this.streamStartTime || _currentTime < this.streamStartTime) {
        return;
      }

      const currentTime = new Date(_currentTime * 1000);
      const streamStartTime = new Date(this.streamStartTime * 1000);

      const duration = intervalToDuration({
        start: streamStartTime,
        end: currentTime
      });

      let seconds = duration.seconds,
        minute = duration.minutes,
        hours = duration.hours;

      const _hours = hours < 10 ? `0${hours}` : `${hours}`;
      minute = minute < 10 ? `0${minute}` : `${minute}`;
      seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

      this.time =
        hours > 0
          ? _hours + ":" + minute + ":" + seconds //
          : minute + ":" + seconds;

      if (seconds > 5) {
        this.canBeSaved = true;
      }
      // this.shownComments = this.comments.filter(i => i.hideTime > Date.now());
    },
    tryToStartStream() {
      this.startingStream = true;
      this.isReadyToStart = false;

      StreamApi.checkActive()
        .then(res => res.json())
        .then(({ hasActive }) => {
          if (hasActive) {
            this.startingStream = false;
            this.$store.dispatch("modal/show", {
              name: "confirm",
              data: {
                title:
                  "You have another stream started. Do you want to stop it?",
                success: () => {
                  this.killActiveStreamAndStart();
                },
                abort: () => {
                  this.$router.push("/");
                },
                hideQuestion: true
              }
            });
          } else {
            this.isStarted = true;
            this.$root.ws.send({
              act: "stream_log",
              stream_id: null,
              stream_user_id: this.$store.state.auth.user.id,
              user_action: "try_to_start",
              stream_data: {
                type: "common",
                view_category: this.streamVisibility.key,
                microphone:
                  this.streamAudio.deviceId === undefined ? "off" : "on",
                date_time: new Date()
              },
              sess: this.$store.state.auth.token
            });

            const token = this.$store.state.auth.token;
            StreamApi.getServerData("webrtc", token).then(serverData => {
              this.streamModule.setConfig("serverData", serverData);
              this.streamModule.startStream();
            });
          }
        });
    },
    killActiveStreamAndStart() {
      return StreamApi.deleteStream().then(() => {
        this.tryToStartStream();
      });
    },
    stopStream() {
      this.isStoppedByButton = true;
      this.requestStreamStat();
      this.$root.ws.send({
        act: "stream_log",
        stream_id: this.startedStreamId,
        stream_user_id: this.$store.state.auth.user.id,
        user_action: "try_to_stop",
        stream_data: {
          type: "common",
          view_category: this.streamVisibility.key,
          microphone: this.streamAudio.deviceId === undefined ? "off" : "on",
          date_time: new Date()
        },
        sess: this.$store.state.auth.token
      });
      this.streamModule.stopStream();
    },
    getLikePosition(data) {
      const video = document.getElementById(this.streamModule.config.videoElId);
      let video_width = video.videoWidth;
      let video_height = video.videoHeight;
      let video_ratio = video_height / video_width;
      const window_width = window.innerWidth;
      const window_height = window.innerHeight;
      const window_ratio = window_height / window_width;
      let left = "0%";
      let top = "100%";

      if (video_ratio > window_ratio) {
        video_height = window_height;
        video_width = video_height / video_ratio;
      } else {
        video_width = window_width;
        video_height = video_width * video_ratio;
      }

      let pos_x = data.x * video_width;
      let pos_y = data.y * video_height;

      if (pos_x) {
        left = pos_x + (window_width - video_width) / 2;
        top = pos_y + (window_height - video_height) / 2;
      }

      return { x: left, y: top };
    },
    updateLikes() {
      const now = Date.now();

      this.likesInterval = setInterval(() => {
        this.likes = this.likes.filter(item => item.date + 5000 < now);
      }, 5000);
    },
    close(e, haveToSave, haveToSaveComments) {
      if (this.isStarted) {
        this.stopStream();
      } else {
        if (haveToSave) {
          this.saving = true;
          this.$root.ws.send({
            act: "stream_log",
            stream_id: this.startedStreamId,
            stream_user_id: this.$store.state.auth.user.id,
            user_action: "try_to_save",
            stream_data: {
              type: "common",
              view_category: this.streamVisibility.key,
              save_comments: haveToSaveComments,
              microphone:
                this.streamAudio.deviceId === undefined ? "off" : "on",
              date_time: new Date()
            },
            sess: this.$store.state.auth.token
          });
          StreamApi.saveStream(this.startedStreamId, haveToSaveComments)
            .then(() => {
              this.$root.ws.send({
                act: "stream_log",
                stream_id: this.startedStreamId,
                stream_user_id: this.$store.state.auth.user.id,
                user_action: "save_success",
                stream_data: {
                  type: "common",
                  view_category: this.streamVisibility.key,
                  save_comments: haveToSaveComments,
                  microphone:
                    this.streamAudio.deviceId === undefined ? "off" : "on",
                  date_time: new Date()
                },
                sess: this.$store.state.auth.token
              });
              this.$router.push("/");
            })
            .catch(error => {
              this.$root.ws.send({
                act: "stream_log",
                stream_id: this.startedStreamId,
                stream_user_id: this.$store.state.auth.user.id,
                user_action: "save_failure",
                stream_data: {
                  type: "common",
                  error_message: error,
                  view_category: this.streamVisibility.key,
                  save_comments: haveToSaveComments,
                  microphone:
                    this.streamAudio.deviceId === undefined ? "off" : "on",
                  date_time: new Date()
                },
                sess: this.$store.state.auth.token
              });
              this.$router.push("/");
            });
        } else {
          this.$router.push("/");
        }

        this.startedStreamId = undefined;
      }
    },
    sendComment() {
      if (!this.newComment.trim()) {
        this.newComment = "";
        return;
      }

      this.$root.ws.ws.send(
        JSON.stringify({
          act: "stream_comment",
          stream_user_id: this.user.id,
          stream_id: this.startedStreamId,
          comment: this.newComment,
          sess: this.$store.state.auth.token
        })
      );
      this.newComment = "";
    },
    sendTipGoal() {
      if (!this.tipsGoal.amount.trim() || !this.tipsGoal.description.trim()) {
        return;
      }
      const data = JSON.stringify({
        act: "stream_goal",
        stream_user_id: this.user.id,
        stream_id: this.startedStreamId,
        description: this.tipsGoal.description,
        sources: this.tipsGoal.sources.map(item => item.value),
        amount: this.tipsGoal.amount,
        sess: this.$store.state.auth.token
      });
      this.$store
        .dispatch("lives/setTipsGoal", {
          amount: this.tipsGoal.amount,
          description: this.tipsGoal.description,
          entityType: "users_streams",
          entityId: this.startedStreamId,
          source: this.tipsGoal.sources.map(item => item.value)
        })
        .then(() => {
          this.$root.ws.ws.send(data);
          this.tipsGoal.amount = 0;
          this.tipsGoal.description = "";
          // this.tipsGoal.sources = [];
          this.showTipsGoalForm = false;
        });
    },
    requestStreamStat() {
      const token = this.$store.state.auth.token;
      const userId = this.$store.state.auth.user.id;

      const common = {
        act: "get_statistics",
        stream_id: this.startedStreamId,
        stream_user_id: userId,
        sess: token
      };

      this.$root.ws.ws.send(
        JSON.stringify({ ...common, code: "stream_look_search_all" })
      );
      this.$root.ws.ws.send(
        JSON.stringify({ ...common, code: "stream_like_search_all" })
      );

      this.$root.ws.ws.send(
        JSON.stringify({ ...common, code: "stream_comment_search_all" })
      );

      this.$root.ws.ws.send(
        JSON.stringify({ ...common, code: "stream_tip_search_all" })
      );
    },
    changeFilter(value) {
      this.streamModule.changeFilter(value);
    },
    showBlockUserConfirm(userId) {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "Block user",
          success: () => this.blockUser(userId)
        }
      });
    },
    blockUser(userId) {
      this.$store
        .dispatch("lives/block", {
          streamId: this.startedStreamId,
          userId
        })
        .then(() => {
          try {
            this.streamModule.sendCustomMessage({
              msgtype: "data.custom",
              to: ["viewer"],
              data: {
                type: "kick.user",
                userId
              }
            });
          } catch (error) {
            console.log("Error while sending sendCustomMessage message ", {});
          }
        });
    },
    showKickUserConfirm(userId) {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: "Kick user",
          success: () => this.kickUserForStream(userId)
        }
      });
    },
    kickUserForStream(userId) {
      try {
        this.streamModule.sendCustomMessage({
          msgtype: "data.custom",
          to: ["viewer"],
          data: {
            type: "kick.user",
            userId
          }
        });
      } catch (error) {
        console.log("Error while sending sendCustomMessage message ", {});
      }
    },
    toggleTipGoalForm() {
      if (!this.showTipsGoalForm && this.isTipsGoalExists) {
        this.tipsGoal.amount = this.activeTipsGoal.amount + "";
        this.tipsGoal.description = this.activeTipsGoal.description;
        // this.tipsGoal.sources = this.activeTipsGoal.sources?.map(item => {
        //   const elem = this.tipsGoal.sourceTypes.find(i => i.value === item);
        //   return elem;
        // });
      }
      this.showTipsGoalForm = !this.showTipsGoalForm;
    },
    getWatermarkData() {
      const watermarkData = {
        type: "watermark",
        data: this.user.publicUrl,
        logo: logoBase64
      };
      if (this.user.watermarkText) {
        watermarkData.data = this.user.watermarkText;
      }
      if (this.user.watermarkFileUpload) {
        watermarkData.logo = this.base64watermark;
      }
      return watermarkData;
    },
    initAudios(audioDevices) {
      this.streamAudios = [{ deviceId: undefined }, ...audioDevices];
      let streamAudioLabel = BrowserStore.get("streamAudio");
      if (typeof streamAudioLabel === "undefined") {
        if (this.streamAudios[1]) {
          streamAudioLabel = this.streamAudios[1].label;
        } else {
          streamAudioLabel = "";
        }
      }
      if (streamAudioLabel === "") {
        this.streamAudio = this.streamAudios[0];
      } else {
        this.streamAudio = this.streamAudios.find(
          v => v.label === streamAudioLabel
        );
      }
    }
  },
  mounted() {
    if (!this.user.isPerformer) {
      this.$router.push("/");
      return;
    }
    this.$store.commit("lives/resetCurrentLive");
    this.$store.dispatch("lives/notifications/init");

    if (this.user.hasWatermarkStream && this.user.watermarkFileUpload) {
      convertImgToBase64URL(this.user.watermarkFileUpload, base64Img => {
        this.base64watermark = base64Img;
      });
    }

    this.streamVisibility =
      this.user.subscribePrice > 0
        ? this.streamVisibilities[0]
        : this.streamVisibilities[1];

    const { onDevicesReadyCallback } = this;
    this.streamModule = new StreamModule();
    window.streamModule = this.streamModule;

    const videoLabel = BrowserStore.get("streamVideo") || "";

    this.streamModule.init({
      debug: getCookie("debug") === window.atob("bWFzdGVyb2ZwdXBwZXRz"),
      thumbEnabled: true,
      videoSave: true,
      videoElId: "myvideo",
      token: (+new Date()).toString(36),
      videoLabel,
      showErrorMessage: message => {
        this.$store.dispatch("global/setError", { message });
        console.trace(message);
        if (message.match(/Some features are not supported/)) {
          this.close();
        }
      },
      showInfoMessage: message => {
        // this.$store.dispatch("global/setError", { message });
        // eslint-disable-next-line
          console.trace(message);
      },
      onLocalStreamInit: () => {},
      onRemoteStreamInit: () => {},
      onStreamError: error => {
        this.$root.ws.send({
          act: "stream_log",
          stream_id: this.startedStreamId,
          stream_user_id: this.$store.state.auth.user.id,
          user_action: "error",
          stream_data: {
            type: "common",
            error_message: error,
            view_category: this.streamVisibility.key,
            microphone: this.streamAudio.deviceId === undefined ? "off" : "on",
            date_time: new Date()
          },
          sess: this.$store.state.auth.token
        });
        // eslint-disable-next-line
          this.$store.dispatch("global/setError", { message: error });
        // eslint-disable-next-line
          console.trace(error);
        this.streamModule.config.onStreamEnd();
      },
      onStreamTick: start => {
        this.tick(start);
      },
      onStreamStart: room => {
        this.updateLikes();
        let type = this.streamVisibility.key;

        const defaultStreamTypes = ["subscribers", "followers", "public"];

        if (!defaultStreamTypes.includes(type)) {
          type = "list";
        }

        StreamApi.runStream({
          room,
          type,
          entityId: type === "list" ? this.streamVisibility.key : undefined
        })
          .then(res => {
            return res.json();
          })
          .then(({ id }) => {
            const token = this.$store.state.auth.token;
            const userId = this.$store.state.auth.user.id;

            this.$root.ws.ws.send(
              JSON.stringify({
                act: "stream_start",
                stream_id: id,
                stream_user_id: userId,
                sess: token
              })
            );
            this.$root.ws.send({
              act: "stream_log",
              stream_id: id,
              stream_user_id: this.$store.state.auth.user.id,
              user_action: "start_success",
              stream_data: {
                type: "common",
                view_category: this.streamVisibility.key,
                microphone:
                  this.streamAudio.deviceId === undefined ? "off" : "on",
                date_time: new Date()
              },
              sess: this.$store.state.auth.token
            });

            this.startedStreamId = id;
            this.startingStream = false;
            this.streamModule.sendCustomMessage({
              msgtype: "data.custom",
              to: ["transcoder"],
              data: this.user.hasWatermarkStream ? this.getWatermarkData() : {}
            });
            this.streamStartTime = new Date().getTime() / 1000;
          });
      },
      onStreamEnd: () => {
        const token = this.$store.state.auth.token;
        const userId = this.$store.state.auth.user.id;

        if (this.startedStreamId) {
          this.$root.ws.ws.send(
            JSON.stringify({
              act: "stream_stop",
              stream_id: this.startedStreamId,
              stream_user_id: userId,
              sess: token
            })
          );

          this.$root.ws.send({
            act: "stream_log",
            stream_id: this.startedStreamId,
            stream_user_id: this.$store.state.auth.user.id,
            user_action: "stop_success",
            stream_data: {
              type: "common",
              view_category: this.streamVisibility.key,
              microphone:
                this.streamAudio.deviceId === undefined ? "off" : "on",
              date_time: new Date()
            },
            sess: this.$store.state.auth.token
          });

          this.finishing = true;

          StreamApi.deleteStream(this.startedStreamId)
            .then(() => {
              this.finishing = false;
            })
            .catch(() => {
              this.finishing = false;
            });
        }

        this.isReadyToStart = true;
        this.isStarted = false;
        this.isStopped = true;
        this.startingStream = false;
      },
      onCleanUp: () => {},
      onViewersCountGet: looks => {
        this.looksCount = looks;
      },
      onCustomDataGet: message => {
        if (message.type === "click.position") {
          const date = Date.now();
          this.$store.commit("lives/addLike");
          let pos =
            message.position !== "btn"
              ? this.getLikePosition(message.position)
              : {
                  x: this.$refs.likeBtn.getBoundingClientRect().left + 25,
                  y: this.$refs.likeBtn.getBoundingClientRect().top + 25
                };

          this.likes.push({
            date,
            ...pos
          });
        }

        if (message.type === "plugin.list") {
          this.filters = message.list.filter(
            filter => filter.parent_id === "face_filters"
          );
        }
      },
      onDevicesReadyCallback
    });
  },
  beforeDestroy() {
    this.streamModule.stopAllTracks(this.streamModule.localStream);
    window.clearInterval(this.likesInterval);
  },
  watch: {
    asideType() {
      if (this.asideType === "comments") {
        this.$nextTick(() => {
          this.$refs.commentInput.focus();
        });
      } else {
        this.newComment = "";
      }
    },
    newLook() {
      this.$store.dispatch("lives/notifications/play", "newLook");
    },
    newTip() {
      this.$store.dispatch("lives/notifications/play", "newTip");
    },
    goalAchieved() {
      this.$store.dispatch("lives/notifications/play", "goalAchieved");
    }
  }
};
</script>
