ц<template>
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
          <div class="mediasHeaderControls">
            <button
              id="stop"
              class="btn alt sm change-devices top"
              @click="close"
            >
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
              <div
                v-if="
                  $mq === 'desktop' && streamVideos && streamVideos.length > 1
                "
                v-click-outside="hideStreamVideoMenu"
                :class="[
                  'btn-media-event has-dropdown camera',
                  {
                    shown: shownStreamVideoMenu,
                    'device-disabled': streamVideo.deviceId === 'disabled'
                  }
                ]"
              >
                <button
                  type="button"
                  class="root-btn"
                  @click="showStreamVideoMenu"
                >
                  <span class="root-btn__inside" />
                </button>
                <div class="menu-overlay" @click="hideStreamVideoMenu"></div>
                <div class="menu">
                  <button
                    v-for="(video, key) in streamVideos"
                    v-bind:key="video.deviceId"
                    type="button"
                    :data-type="video.deviceId"
                    :class="[
                      'item',
                      { active: streamVideo.deviceId === video.deviceId }
                    ]"
                    @click="() => setStreamVideo(video)"
                  >
                    <span class="value">{{
                      video.label || `Camera ${key}`
                    }}</span>
                  </button>
                </div>
              </div>
              <div
                v-if="streamAudio"
                v-click-outside="hideStreamAudioMenu"
                :class="[
                  'btn-media-event has-dropdown microphone',
                  {
                    shown: shownStreamAudioMenu,
                    'device-disabled': streamAudio.deviceId === undefined
                  }
                ]"
              >
                <button
                  type="button"
                  class="root-btn"
                  @click="showStreamAudioMenu"
                >
                  <span class="root-btn__inside" />
                </button>
                <div class="menu-overlay" @click="hideStreamAudioMenu"></div>
                <div class="menu">
                  <button
                    v-for="(audio, key) in streamAudios"
                    v-bind:key="audio.deviceId"
                    type="button"
                    :data-type="audio.deviceId"
                    :class="[
                      'item',
                      { active: streamAudio.deviceId === audio.deviceId }
                    ]"
                    @click="() => setStreamAudio(audio)"
                  >
                    <span class="value">{{
                      !audio.deviceId
                        ? "Disable Microphone"
                        : audio.label || `Microphone ${key}`
                    }}</span>
                  </button>
                </div>
              </div>
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
          TIP Countdown: ${{ activeTipsGoal.amount }} for
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
            v-if="$root.showTips"
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
            v-if="!isTipsGoalExists"
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
import StreamModule from "streaming-module/stream_module";
import StreamApi from "@/api/stream";
import ClickOutside from "vue-click-outside";
import logoBase64 from "./logo";
import Comments from "@/components/common/streamComments/Index";
import StreamViewers from "@/components/pages/stream/Viewers";
import { getCookie } from "@/components/pages/stream/debug";
import moment from "moment";
import LoadScripts from "@/components/statistics/loadScripts";

export default {
  name: "Stream",
  directives: {
    ClickOutside
  },
  mixins: [userMixin, LoadScripts],
  data() {
    return {
      streamVisibility: {},
      shownStreamVisibilityMenu: false,

      streamVideos: undefined,
      streamVideo: undefined,
      shownStreamVideoMenu: false,

      streamAudios: undefined,
      streamAudio: undefined,
      shownStreamAudioMenu: false,

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
        description: ""
      },
      showTipsGoalForm: false
    };
  },
  components: {
    Loader,
    StreamStatistic,
    Filters,
    Comments,
    StreamViewers
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
      return [
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
    },
    activeTipsGoal() {
      return this.$store.state.lives.currentLive.tipsGoal;
    },
    isTipsGoalExists() {
      return this.activeTipsGoal.description && this.activeTipsGoal.amount;
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
      this.shownStreamVideoMenu = false;
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
    showStreamAudioMenu() {
      this.shownStreamAudioMenu = true;
    },
    hideStreamAudioMenu() {
      this.shownStreamAudioMenu = false;
    },
    setStreamAudio(value) {
      this.streamModule.switchDevices(value.deviceId, false);
      this.streamAudio = value;
      this.shownStreamAudioMenu = false;
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
      this.streamAudios = [{ deviceId: undefined }, ...audioDevices];
      this.streamAudio = this.streamAudios[1];

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

      const currentTime = moment.unix(_currentTime);
      const streamStartTime = moment.unix(this.streamStartTime);

      const diffTime = currentTime.diff(streamStartTime);
      const duration = moment.duration(diffTime);

      let seconds = duration.seconds(),
        minute = duration.minutes(),
        hours = duration.hours();

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
            this.streamModule.startStream();
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
          StreamApi.saveStream(this.startedStreamId, haveToSaveComments)
            .then(() => {
              this.$router.push("/");
            })
            .catch(() => {
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
        amount: this.tipsGoal.amount,
        sess: this.$store.state.auth.token
      });
      console.log(data);
      this.$root.ws.ws.send(data);
      this.tipsGoal.amount = 0;
      this.tipsGoal.description = "";
      this.showTipsGoalForm = false;
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

      if (this.$root.showTips) {
        this.$root.ws.ws.send(
          JSON.stringify({ ...common, code: "stream_tip_search_all" })
        );
      }
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
      this.showTipsGoalForm = !this.showTipsGoalForm;
    }
  },
  mounted() {
    if (!this.user.isPerformer) {
      this.$router.push("/");
      return;
    }
    this.$store.commit("lives/resetCurrentLive");

    this.streamVisibility =
      this.user.subscribePrice > 0
        ? this.streamVisibilities[0]
        : this.streamVisibilities[1];

    const { onDevicesReadyCallback } = this;
    const token = this.$store.state.auth.token;
    this.streamModule = new StreamModule();
    window.streamModule = this.streamModule;

    this.streamModule.init({
      debug: getCookie("debug") === window.atob("bWFzdGVyb2ZwdXBwZXRz"),
      thumbEnabled: true,
      videoSave: true,
      getApiUrl: StreamApi.getStreamPath(token),
      clientGetApiUrl: null,
      videoElId: "myvideo",
      token: (+new Date()).toString(36),
      showErrorMessage: message => {
        this.$store.dispatch("global/setError", { message });
        console.trace(message);
        if (message.match(/Some features are not supported/)) {
          this.close();
        }
      },
      showInfoMessage: message => {
        // eslint-disable-next-line
        console.trace(message);
      },
      onLocalStreamInit: () => {},
      onRemoteStreamInit: () => {},
      onStreamError: error => {
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
        const type = this.streamVisibility.key;

        StreamApi.runStream({
          room,
          type
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

            this.startedStreamId = id;
            this.startingStream = false;
            this.streamModule.config.clientGetApiUrl = StreamApi.getStreamClientPath(
              id,
              token
            );
            this.streamModule.getStreamAsClient();
            this.streamModule.sendCustomMessage({
              msgtype: "data.custom",
              to: ["transcoder"],
              data: {
                type: "watermark",
                data: this.user.publicUrl,
                logo: logoBase64
              }
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
        this.looksCount = looks - 1;
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
    }
  }
};
</script>
