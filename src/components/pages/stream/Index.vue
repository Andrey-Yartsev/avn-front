<template>
  <div class="stream-container" :class="{stream_enabled: isStarted, stream_stop: isStopped}">
    <div class="loader-container" v-if="!user">
      <Loader :fullscreen="false" text="" class="transparent small" />
    </div>
    <div class="stream " v-else>
      <div class="mediasTop">
        <div class="mediasTop__header">
          <span class="category-name category-name_live hidden-mobile" @click="close">Live video</span>
          <button class="close" @click="close">
            <span class="category-name category-name_live hidden-desktop">Live Video</span>
          </button>
          <div class="mediasHeaderControls">
            <button class="btn alt sm change-devices top" @click="startStream">Start</button>
            <button id="stop" class="btn alt sm change-devices top" @click="close">Stop</button>
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
                  <button type="button" class="root-btn" @click="showStreamVisibilityMenu">
                    <span class="root-btn__inside">{{ streamVisibility.label }}</span>
                  </button>
                  <div class="menu">
                    <button
                      type="button"
                      v-for="streamVisib in streamVisibilities"
                      v-bind:key="streamVisib.key"
                      :class="['item', { active: streamVisibility.key === streamVisib.key }]"
                      @click="() => setStreamVisibility(streamVisib)"
                      :disabled="streamVisib.disabled"
                    >
                      <span class="value">{{ streamVisib.label }}</span>
                    </button>
                  </div>
                </div>
                <div
                  v-if="streamVideo"
                  v-click-outside="hideStreamVideoMenu"
                  :class="[
                    'btn-media-event has-dropdown camera',
                    {
                      shown: shownStreamVideoMenu,
                      'device-disabled': streamVideo.deviceId === 'disabled'
                    }
                ]">
                  <button type="button" class="root-btn" @click="showStreamVideoMenu">
                    <span class="root-btn__inside" />
                  </button>
                  <div class="menu">
                    <button
                      v-for="video in streamVideos"
                      v-bind:key="video.deviceId"
                      type="button"
                      :data-type="video.deviceId"
                      :class="['item', { active: streamVideo.deviceId === video.deviceId }]"
                      @click="() => setStreamVideo(video)"
                    >
                      <span class="value">{{ video.label }}</span>
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
                ]">
                <button type="button" class="root-btn" @click="showStreamAudioMenu">
                  <span class="root-btn__inside" />
                </button>
                <div class="menu">
                  <button
                    v-for="audio in streamAudios"
                    v-bind:key="audio.deviceId"
                    type="button"
                    :data-type="audio.deviceId"
                    :class="['item', { active: streamAudio.deviceId === audio.deviceId }]"
                    @click="() => setStreamAudio(audio)"
                  >
                    <span class="value">{{ audio.label || "Disable Microphone" }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="videos">
        <div id="videowrap" class="stream-video-container">
          <div class="likesContainer">
            <div v-for="like in likes" :id="like.date" :key="like.date" class="like" :style="{ top: `${like.y}px`, left: `${like.x}px`}">
              <div class='like-icon'><div class='like-icon__symbol' /></div>
            </div>
          </div>
          <video
            class="rounded centered"
            id="myvideo"
            autoplay=""
            muted=""
            playsinline=""
            v-if="!isStopped"
          />
        </div>
        <div id="stream-timer"
          v-if="!isStopped"
        >{{ time }}</div>
        <div class="stream-online-label">live</div>
        <div class="stream-comments-wrapper">
          <div class="item" v-for="comment in comments" v-bind:key="comment.comment">
            <span class="avatar">
              <img :src="comment.user.avatar" />
            </span>
            <span class="name">{{ comment.user.name }}</span>
            <span class="text">{{ comment.comment }}</span>
          </div>
        </div>
        <form class="stream-comment-form" v-if="showCommentForm">
          <input
            type="text"
            placeholder="Comment"
            class="stream-comment-input rounded lg"
            maxlength="24"
            v-model="newComment"
            @keypress.enter.prevent="sendComment"
          >
          <button
            @click="sendComment"
            type="button"
            class="stream-comment-send-btn"
            :disabled="!newComment.length"
          ></button>
        </form>
        <div class="stream-btns stream-viewer-btns">
          <span role="button" class="stream-comment-btn" @click="showCommentForm = !showCommentForm"></span>
          <span class="stream-like-btn" ref="likeBtn">{{ likesCount }}</span>
          <span class="stream-tip-btn" v-if="false"></span>
          <span class="stream-online-count">{{ looksCount }}</span>
        </div>
      </div>
      <div class="mediasBottom">
        <button
          class="btn alt lg change-devices"
          @click="startStream"
        >Start live video</button>
      </div>
    </div>
    <StreamStatistic
      :close="(haveToSave) => close(haveToSave)"
      :duration="time"
      v-if="isStopped"
    />
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import StreamStatistic from "@/components/pages/stream/Statistic";
import userMixin from "@/mixins/user";
import Streams from "streaming-module/stream_module";
import StreamApi from "@/api/stream";
import ClickOutside from "vue-click-outside";

export default {
  name: "Stream",
  directives: {
    ClickOutside
  },
  mixins: [userMixin],
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
      time: undefined,
      startedStreamId: undefined,
      likes: [],
      newComment: "",
      looksCount: 0,
      showCommentForm: false
    };
  },
  components: {
    Loader,
    StreamStatistic
  },
  computed: {
    likesCount() {
      return this.$store.state.lives.currentLive.likesCount;
    },
    comments() {
      return this.$store.state.lives.currentLive.comments;
    },
    streamVisibilities() {
      return [
        {
          key: "subscribers",
          label: "Subscribers only",
          disabled: !this.canEarnMoney
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
      Streams.switchDevices(false, value.deviceId);
      this.streamVideo = value;
      this.shownStreamVideoMenu = false;
    },
    showStreamAudioMenu() {
      this.shownStreamAudioMenu = true;
    },
    hideStreamAudioMenu() {
      this.shownStreamAudioMenu = false;
    },
    setStreamAudio(value) {
      Streams.switchDevices(value.deviceId, false);
      this.streamAudio = value;
      this.shownStreamAudioMenu = false;
    },
    onDevicesReadyCallback() {
      const {
        audioDevices,
        /* defaultAudioDevice, */
        videoDevices,
        defaultVideoDevice
      } = Streams.getDevices();

      this.isReadyToStart = true;

      this.streamVideos = videoDevices;
      this.streamVideo = defaultVideoDevice;
      this.streamAudios = audioDevices;
      this.streamAudio = audioDevices[1];
    },
    tick(start) {
      const diff = Math.round(new Date().getTime() / 1000) - start;
      const date = new Date(diff * 1000);
      let hours = date.getHours();
      let mins = date.getMinutes();
      let secs = date.getSeconds();
      hours = hours < 10 ? `0${hours}` : `${hours}`;
      mins = mins < 10 ? `0${mins}` : `${mins}`;
      secs = secs < 10 ? `0${secs}` : `${secs}`;
      this.time =
        diff > 3600 ? hours + ":" + mins + ":" + secs : mins + ":" + secs;
    },
    startStream() {
      this.isReadyToStart = false;
      this.isStarted = true;
      Streams.startStream();
    },
    stopStream() {
      this.requestStreamStat();
      Streams.stopStream();
    },
    getLikePosition(data) {
      const video = document.getElementById(Streams.config.videoElId);
      let video_width = video.videoWidth;
      let video_height = video.videoHeight;
      let video_ratio = video_height / video_width;
      const window_width = window.innerWidth;
      const window_height = window.innerHeight;
      const window_ratio = window_height / window_width;
      let left = "0%"; //$( '.stream-like-btn' ).offset().left;
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
    close(haveToSave) {
      if (this.isStarted) {
        this.stopStream();
      } else {
        if (haveToSave) {
          StreamApi.saveStream(this.startedStreamId)
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
        JSON.stringify({ ...common, code: "stream_tip_search_all" })
      );
      this.$root.ws.ws.send(
        JSON.stringify({ ...common, code: "stream_comment_search_all" })
      );
    }
  },
  mounted() {
    this.$store.commit("lives/resetCurrentLive");

    this.streamVisibility =
      this.user.subscribePrice > 0
        ? this.streamVisibilities[0]
        : this.streamVisibilities[1];

    const { onDevicesReadyCallback } = this;
    const token = this.$store.state.auth.token;
    window.Streams = Streams;
    Streams.init({
      thumbEnabled: true,
      videoSave: true,
      getApiUrl: StreamApi.getStreamPath(token),
      clientGetApiUrl: "https://gpu3.view.me/webrtc-api",
      videoElId: "myvideo",
      token: (+new Date()).toString(36),
      streamSource: "client",
      showLikes: false,
      showMessage(message) {
        // eslint-disable-next-line
        console.log(message);
      },
      onLocalStreamInit() {},
      onRemoteStreamInit() {},
      onStreamError(error) {
        // eslint-disable-next-line
        console.error(error);
        Streams.config.onStreamEnd();
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
            Streams.config.clientGetApiUrl = StreamApi.getStreamClientPath(
              id,
              token
            );
          });
      },
      onStreamEnd: () => {
        const token = this.$store.state.auth.token;
        const userId = this.$store.state.auth.user.id;

        this.$root.ws.ws.send(
          JSON.stringify({
            act: "stream_stop",
            stream_id: this.startedStreamId,
            stream_user_id: userId,
            sess: token
          })
        );

        StreamApi.deleteStream(this.startedStreamId);

        this.isReadyToStart = true;
        this.isStarted = false;
        this.isStopped = true;
      },
      onCleanUp() {},
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
      },
      onDevicesReadyCallback
    });
  },
  beforeDestroy() {
    Streams.stopAllTracks(Streams.localStream);
    window.clearInterval(this.likesInterval);
  }
};
</script>
