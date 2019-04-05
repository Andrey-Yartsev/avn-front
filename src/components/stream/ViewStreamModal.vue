<template>
  <Modal :onClose="close">
    <template slot="content">
      <div id="stream">
        <div id="stream-timer">{{ time }}</div>
        <div class="stream-online-label">live</div>
        <span role="button" id="close-stream-window" @click="stopWatching" />
        <div class="likesContainer">
          <div
            v-for="like in likes"
            :id="like.date"
            :key="like.date"
            class="like"
            :style="{ top: `${like.y}px`, left: `${like.x}px` }"
          >
            <div class="like-icon"><div class="like-icon__symbol" /></div>
          </div>
        </div>
        <video
          id="remotevideo"
          width="320"
          height="240"
          playsinline=""
          autoplay=""
          @click="click"
        ></video>
        <div class="popup" v-if="streamIsFinished">
          <div class="overlay"></div>
          <div class="popup-container popup-alert">
            <div class="popup-alert__msg">
              Live video has ended
            </div>
            <div class="popup-alert__btn">
              <button class="btn lg" @click="close">Close</button>
            </div>
          </div>
        </div>
        <div class="stream-comments-wrapper">
          <div
            class="item"
            v-for="comment in shownComments"
            v-bind:key="comment.comment"
          >
            <span class="avatar avatar_not-shadow avatar_ex-sm avatar_gap-r-sm">
              <span class="avatar__img">
                <img :src="comment.user.avatar" />
              </span>
            </span>
            <span class="name">{{ comment.user.name }}</span>
            <span class="text">{{ comment.comment }}</span>
          </div>
        </div>
        <div class="form-stream">
          <form
            class="stream-comment-form"
            v-if="showCommentForm && !isMyStream"
          >
            <input
              type="text"
              placeholder="Comment"
              class="stream-comment-input rounded lg"
              maxlength="24"
              v-model="newComment"
              @keypress.enter.prevent="sendComment"
            />
            <button
              @click="sendComment"
              type="button"
              class="stream-comment-send-btn"
              :disabled="!newComment.length"
            ></button>
          </form>
          <Tip
            v-if="$root.showTips"
            :class="{ show: showTip }"
            :user="streamer"
            ref="tip"
            @cancel="closeTip"
            :tipId="`s${this.$store.state.modal.stream.data.stream.id}`"
          />
        </div>
        <div
          class="stream-btns stream-viewer-btns"
          v-if="connected && !isMyStream"
        >
          <span
            role="button"
            class="stream-btn stream-comment-btn"
            @click="showCommentForm = !showCommentForm"
          ></span>
          <span
            class="stream-btn stream-like-btn"
            @click="throttledLike"
          ></span>
          <span
            class="stream-btn stream-tip-btn"
            type="button"
            v-if="streamer.canEarn && $root.showTips"
            @click="showTip = !showTip"
          ></span>
          <span class="stream-online-count" v-if="false"></span>
        </div>
      </div>
    </template>
  </Modal>
</template>
<script>
import { throttle } from "throttle-debounce";
import Loader from "@/components/common/Loader";
import Modal from "@/components/modal/Index";
import userMixin from "@/mixins/user";
import Streams from "streaming-module/view_module";
import StreamApi from "@/api/stream";
import moment from "moment";
import Tip from "@/components/common/tip/User";

export default {
  name: "ViewStremModal",
  components: {
    Modal,
    Loader,
    Tip
  },
  mixins: [userMixin],
  data: () => ({
    loading: true,
    time: undefined,
    shouldUpdateTimer: false,
    streamIsFinished: false,
    likes: [],
    newComment: "",
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
      return this.$store.state.lives.currentLive.comments;
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
      const { id } = this.$store.state.modal.stream.data.stream.user;
      return this.user.id === id;
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
      Streams.stopStream(false, true);

      const token = this.$store.state.auth.token;
      const id = this.$store.state.modal.stream.data.stream.id;
      const userId = this.$store.state.modal.stream.data.stream.user.id;

      this.$root.ws.ws.send(
        JSON.stringify({
          act: "stream_unlook",
          stream_id: id,
          stream_user_id: userId,
          sess: token
        })
      );
      this.close();
    },
    updateTimer() {
      if (!this.shouldUpdateTimer) return;

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
      const video = Streams.config.remoteVideo;
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
      if (!this.connected || this.isMyStream) {
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

      Streams.sendCustomMessage({
        msgtype: "data.custom",
        to: ["streamer"],
        data: {
          type: "click.position",
          position
        }
      });

      this.$root.ws.ws.send(
        JSON.stringify({
          act: "stream_like",
          stream_id: id,
          stream_user_id: userId,
          sess: token
        })
      );

      this.likes.push({
        date,
        x: event.clientX,
        y: event.clientY
      });
    },
    sendComment() {
      const token = this.$store.state.auth.token;
      const id = this.$store.state.modal.stream.data.stream.id;
      const userId = this.$store.state.modal.stream.data.stream.user.id;

      this.$root.ws.ws.send(
        JSON.stringify({
          act: "stream_comment",
          stream_user_id: userId,
          stream_id: id,
          comment: this.newComment,
          sess: token
        })
      );
      this.newComment = "";
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
    Streams.config.getApiUrl = StreamApi.getStreamClientPath(id, token);
    Streams.config.remoteVideo = document.getElementById("remotevideo");
    Streams.viewStream();
    this.updateLikes();
  },
  created() {
    Streams.init({
      getApiUrl: undefined,
      remoteVideo: document.getElementById("remotevideo"),
      showLikes: false,
      showErrorMessage: function(message) {
        alert(message);
      },
      showInfoMessage: function(message) {
        alert(message);
      },
      onStreamEnd: (isError, isClient) => {
        this.shouldUpdateTimer = false;
        this.time = undefined;
        this.connected = false;

        if (!isClient) {
          this.streamIsFinished = true;
        }

        if (isError) {
          alert("An error was happened");
          this.close();
        }
      },

      onStreamInit: () => {
        const token = this.$store.state.auth.token;
        const id = this.$store.state.modal.stream.data.stream.id;
        const userId = this.$store.state.modal.stream.data.stream.user.id;

        this.$root.ws.ws.send(
          JSON.stringify({
            act: "stream_look",
            stream_id: id,
            stream_user_id: userId,
            sess: token
          })
        );
      },

      onSetupStreamingSession: function() {},

      onStreamError: function(error) {
        alert(error);
      },

      onRemoteVideoUnavailable: function() {
        this.connected = false;
        alert("No remote video available");
      },

      onInit: function() {},

      onVideoPlaying: () => {
        this.connected = true;
        this.shouldUpdateTimer = true;
        this.updateTimer();
      },

      onCleanUp: function() {},

      onCustomDataGet: function(/* message */) {
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
    this.connected = false;
    this.shouldUpdateTimer = false;
    window.clearInterval(this.likesInterval);
  },
  watch: {
    funded() {
      const token = this.$store.state.auth.token;
      const id = this.$store.state.modal.stream.data.stream.id;
      const userId = this.$store.state.modal.stream.data.stream.user.id;
      const { success, toUserId, amount, tipId } = this.tipData;

      if (success && `${toUserId}` === `${userId}` && `${tipId}` === `s${id}`) {
        this.$root.ws.ws.send(
          JSON.stringify({
            act: "stream_tip",
            stream_id: id,
            stream_user_id: userId,
            amount,
            owner: userId,
            sess: token
          })
        );
      }

      this.closeTip();
    }
  }
};
</script>
