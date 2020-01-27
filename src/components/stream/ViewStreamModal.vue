<template>
  <Modal :onClose="close">
    <template slot="content">
      <div id="stream" class="stream-block">
        <div class="mediasTop__header stream-header">
          <div id="stream-timer">{{ time }}</div>
          <div class="stream-author" v-if="!isMyStream">
            <router-link
              :to="'/' + streamer.username"
              class="avatar avatar_md avatar_not-shadow"
            >
              <span class="avatar__img">
                <img :src="streamer.avatar" v-if="streamer.avatar" />
              </span>
              <div class="stream-online-label">live</div>
            </router-link>
            <div class="user-name">
              <router-link :to="'/' + streamer.username" class="name">
                {{ streamer.name }}
              </router-link>
            </div>
          </div>
          <div class="stream-online-label" v-else>
            live
          </div>
          <div
            class="stream-tipsGoalTitle"
            v-if="activeTipsGoal.amount && activeTipsGoal.description"
          >
            TIP Countdown: ${{ activeTipsGoal.amount }} for
            {{ activeTipsGoal.description }}
          </div>
          <span
            role="button"
            id="close-stream-window"
            class="close close_light close_visible-mob icn-item icn-size_lg"
            @click="stopWatching"
          />
        </div>
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
        <div class="stream-video-container">
          <video
            id="remotevideo"
            width="320"
            height="240"
            playsinline=""
            autoplay=""
            @click="click"
            @contextmenu.prevent="() => false"
            @dragstart.prevent="() => false"
          />
        </div>
        <div class="popup" v-if="streamIsFinished">
          <div class="overlay" />
          <div class="popup-container popup-container_block popup-alert">
            <div class="popup-alert__msg">
              Live video has ended
            </div>
            <div class="popup-alert__btn">
              <button class="btn lg" @click="close">Close</button>
            </div>
          </div>
        </div>
        <div class="stream-forms">
          <div class="form-comments">
            <Comments :shownComments="shownComments" :count="5" />
            <AddComment
              v-if="showCommentForm && !isMyStream"
              ref="addComment"
            />
            <Tip
              v-if="$root.showTips && showTip"
              :user="streamer"
              ref="tip"
              @cancel="closeTip"
              :tipId="`s${this.$store.state.modal.stream.data.stream.id}`"
              class="tip-form_viewer"
              :needLgClassName="true"
            />
          </div>
        </div>
        <div class="bottom-btns" v-if="connected && !isMyStream && isLogedUser">
          <span role="button" class="bottom-btn" @click="openCommentForm">
            <span
              class="btn-icon comments icn-item icn-size_lg"
              v-tooltip="'Comments'"
            ></span>
          </span>
          <span class="stream-btn bottom-btn" @click="throttledLike">
            <span
              class="btn-icon likes icn-item icn-size_lg"
              v-tooltip="'Likes'"
            ></span>
          </span>
          <span
            class="bottom-btn"
            type="button"
            v-if="streamer.canEarn && $root.showTips"
            @click="openTipForm"
          >
            <span
              class="btn-icon icn-tips icn-item icn-size_lg"
              v-tooltip="'Tips'"
            ></span>
          </span>
          <span class="stream-online-count" v-if="false">
            <span
              class="looking btn-icon icn-item icn-size_lg"
              v-tooltip="'Viewers'"
            ></span>
          </span>
        </div>
        <!--
        <div v-else class="bottom-btns">
          <span role="button" class="bottom-btn" @click="openCommentForm">
            <span
              class="btn-icon comments icn-item icn-size_lg"
              v-tooltip="'Comments'"
            ></span>
          </span>
        </div>
        -->
      </div>
    </template>
  </Modal>
</template>
<script>
import { throttle } from "throttle-debounce";
import Loader from "@/components/common/Loader";
import Modal from "@/components/modal/Index";
import userMixin from "@/mixins/user";
import ViewModule from "streaming-module/view_module";
import StreamApi from "@/api/stream";
import moment from "moment";
import Tip from "@/components/common/tip/User";
import Comments from "@/components/common/streamComments/Index";
import AddComment from "@/components/common/streamComments/AddComment";
import { getCookie } from "@/components/pages/stream/debug";

export default {
  name: "ViewStremModal",
  components: {
    Modal,
    Loader,
    Tip,
    Comments,
    AddComment
  },
  mixins: [userMixin],
  data: () => ({
    loading: true,
    time: undefined,
    shouldUpdateTimer: false,
    streamIsFinished: false,
    likes: [],
    showCommentForm: false,
    showTip: false,
    connected: false,
    shownComments: []
  }),
  computed: {
    throttledLike() {
      return throttle(300, this.like);
    },
    comments() {
      return this.$store.state.lives.currentLive.comments.filter(comment => {
        return comment.stream_user_id === this.streamer.id;
      });
    },
    streamer() {
      return this.$store.state.modal.stream.data.stream.user;
    },
    funded() {
      return this.$store.state.tip.funded;
    },
    tipData() {
      return this.$store.state.tip.tipData;
    },
    isMyStream() {
      if (!this.user) {
        return false;
      }
      const { id } = this.$store.state.modal.stream.data.stream.user;
      return this.user.id === id;
    },
    activeTipsGoal() {
      return this.$store.state.lives.currentLive.tipsGoal;
    }
  },
  methods: {
    updateLikes() {
      const now = Date.now();

      this.likesInterval = setInterval(() => {
        this.likes = this.likes.filter(item => item.date + 5000 < now);
      }, 5000);
    },
    stopWatching() {
      const token = this.$store.state.auth.token;
      const id = this.$store.state.modal.stream.data.stream.id;
      const userId = this.$store.state.modal.stream.data.stream.user.id;

      this.$root.ws.send({
        act: "stream_unlook",
        stream_id: id,
        stream_user_id: userId,
        sess: token
      });

      this.viewModule.stopStream(false, true);

      this.close();
    },
    updateTimer() {
      if (
        !this.shouldUpdateTimer ||
        !this.$store.state.modal.stream.data.stream
      ) {
        return;
      }

      const start = moment(
        this.$store.state.modal.stream.data.stream.startedAt,
        "YYYY-MM-DDTHH:mm:ssZ"
      );
      const now = moment();

      const delta = moment.duration(now - start);
      const h = delta.hours();
      const m = delta.minutes();
      const s = delta.seconds();

      const HH = h >= 10 ? h : `0${h}`;
      const MM = m >= 10 ? m : `0${m}`;
      const SS = s >= 10 ? s : `0${s}`;

      this.time = h > 0 ? `${HH}:${MM}:${SS}` : `${MM}:${SS}`;

      this.shownComments = this.comments.filter(i => i.hideTime > Date.now());

      setTimeout(() => {
        this.updateTimer();
      }, 1000);
    },
    close() {
      this.$store.dispatch("modal/hide", {
        name: "stream"
      });
    },
    getLikePosition(event) {
      const video = this.viewModule.config.remoteVideo;
      let video_width = video.videoWidth;
      let video_height = video.videoHeight;
      const video_ratio = video_height / video_width;
      const window_width = window.innerWidth;
      const window_height = window.innerHeight;
      const window_ratio = window_height / window_width;

      let pos_x = event.clientX;
      let pos_y = event.clientY;

      if (video_ratio > window_ratio) {
        video_height = window_height;
        video_width = video_height / video_ratio;
        pos_x = pos_x - (window_width - video_width) / 2;
        if (0 >= pos_x || pos_x >= video_width) {
          pos_x = 0;
          pos_y = 0;
        }
      } else {
        video_width = window_width;
        video_height = video_width * video_ratio;
        pos_y = pos_y - (window_height - video_height) / 2;
        if (0 >= pos_y || pos_y >= video_height) {
          pos_x = 0;
          pos_y = 0;
        }
      }

      const x = pos_x / video_width;
      const y = pos_y / video_height;

      return { x, y };
    },
    click(event) {
      if (!this.connected || this.isMyStream || !this.isAuth()) {
        return;
      }

      const position = this.getLikePosition(event);
      this.throttledLike(event, position);
    },
    like: function(event, position = "btn") {
      const date = Date.now();
      const token = this.$store.state.auth.token;
      const id = this.$store.state.modal.stream.data.stream.id;
      const userId = this.$store.state.modal.stream.data.stream.user.id;

      try {
        this.viewModule.sendCustomMessage({
          msgtype: "data.custom",
          to: ["streamer"],
          data: {
            type: "click.position",
            position
          }
        });
      } catch (error) {
        console.log("Error while sending sendCustomMessage message ", {});
      }

      this.$root.ws.send({
        act: "stream_like",
        stream_id: id,
        stream_user_id: userId,
        sess: token
      });

      this.likes.push({
        date,
        x: event.clientX,
        y: event.clientY
      });
    },
    openCommentForm() {
      if (!this.$store.state.auth.user) {
        this.$store.dispatch("modal/show", {
          name: "login"
        });
        this.$store.commit("global/toastShowTrigger", {
          text: "To send chat comments, you have to login",
          type: "warning"
        });
        return;
      }
      this.showCommentForm = !this.showCommentForm;
      this.showTip = false;
    },
    openTipForm() {
      this.showTip = !this.showTip;
      this.showCommentForm = false;
    },
    closeTip() {
      this.showTip = false;
      this.$refs.tip.reset();
    }
  },
  mounted() {
    this.$store.commit("lives/resetCurrentLive");
    const token = this.$store.state.auth.token;
    const id = this.$store.state.modal.stream.data.stream.id;

    this.viewModule.config.getApiUrl = StreamApi.getStreamClientPath(id, token);
    this.viewModule.config.remoteVideo = document.getElementById("remotevideo");
    this.viewModule.viewStream();

    this.updateLikes();
    document.body.classList.add("stream-viewer");
  },
  created() {
    const onViewerKicked = () => {
      this.$store.commit("lives/resetCurrentLive");

      this.$store.dispatch("global/flashToast", {
        text: "You were kicked by the broadcaster",
        type: "error"
      });
      this.stopWatching();
      this.$root.$emit("homePageReload");
      this.$router.push("/");
    };

    this.viewModule = new ViewModule();
    window.viewModule = this.viewModule; // export viewModule var to global space

    this.viewModule.init({
      debug: getCookie("debug") === window.atob("bWFzdGVyb2ZwdXBwZXRz"),
      getApiUrl: undefined,
      remoteVideo: document.getElementById("remotevideo"),
      showLikes: false,
      showErrorMessage: message => {
        this.$store.dispatch("global/setError", { message });
      },
      showInfoMessage: message => {
        this.$store.dispatch("global/setError", { message });
      },
      onStreamEnd: (isError, isClient) => {
        this.shouldUpdateTimer = false;
        this.time = undefined;
        this.connected = false;

        if (!isClient) {
          this.streamIsFinished = true;
        }

        if (isError) {
          this.$store.dispatch("global/setError", {
            message: "An error occurred"
          });
          this.close();
        }
      },
      onViewerKicked: () => {
        onViewerKicked();
      },
      onStreamInit: () => {
        const token = this.$store.state.auth.token;
        const id = this.$store.state.modal.stream.data.stream.id;
        const userId = this.$store.state.modal.stream.data.stream.user.id;

        this.$root.ws.send({
          act: "stream_look",
          stream_id: id,
          stream_user_id: userId,
          sess: token
        });
      },

      onSetupStreamingSession: () => {},

      onStreamError: error => {
        if (error.match(/403/)) {
          this.$store.dispatch("global/setError", {
            message: "You have been blocked on this stream"
          });
        } else {
          this.$store.dispatch("global/setError", { message: error });
        }
      },

      // onRemoteVideoUnavailable: () => {
      //   this.connected = false;
      //   if (!this.$store.state.modal.stream.data.stream) {
      //     return;
      //   }
      //   this.$store.dispatch("global/setError", {
      //     message: "No remote video available"
      //   });
      // },

      onInit: () => {},

      onVideoPlaying: () => {
        this.connected = true;
        this.shouldUpdateTimer = true;
        this.updateTimer();
      },

      onCleanUp: () => {},

      onCustomDataGet: message => {
        if (message.type === "kick.user" && this.user.id === message.userId) {
          onViewerKicked();
        }

        // if (message.type === "video") {
        //   document.getElementById("video-muted").innerText = message.is_mute
        //     ? "Video muted"
        //     : "Video not muted";
        // } else if (message.type === "audio") {
        //   document.getElementById("audio-muted").innerText = message.is_mute
        //     ? "Audio muted"
        //     : "Audio not muted";
        // }
      }
    });
  },
  beforeDestroy() {
    this.$store.commit("lives/goal", {});
    this.connected = false;
    this.shouldUpdateTimer = false;
    window.clearInterval(this.likesInterval);
    document.body.classList.remove("stream-viewer");
  },
  watch: {
    showCommentForm() {
      if (this.showCommentForm) {
        this.$nextTick(() => {
          this.$refs.addComment.focus();
        });
      } else {
        this.newComment = "";
      }
    },
    funded() {
      const token = this.$store.state.auth.token;
      const id = this.$store.state.modal.stream.data.stream.id;
      const userId = this.$store.state.modal.stream.data.stream.user.id;
      const { success, toUserId, amount, tipId } = this.tipData;

      if (success && `${toUserId}` === `${userId}` && `${tipId}` === `s${id}`) {
        this.$root.ws.send({
          act: "stream_tip",
          stream_id: id,
          stream_user_id: userId,
          amount,
          owner: userId,
          sess: token
        });
      }

      this.closeTip();
    }
  }
};
</script>
