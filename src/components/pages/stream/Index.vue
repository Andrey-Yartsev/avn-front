<template>
  <div :class="{stream_enabled: isStarted}">
    <div class="loader-container" v-if="!user">
      <Loader :fullscreen="false" text="" class="transparent small" />
    </div>
    <div class="stream " v-else>
      <div class="main-container">
        <div class="mediasTop">
          <div class="mediasTop__header">
            <div class="mediasHeaderControls">
              <button class="btn alt sm change-devices top">Start</button>
              <button id="stop">Stop</button>
            </div>
          </div>
          <div class="chat-new-type add-new-type add-new-type_b-with-text add-new-type_underline-items line-bottom">
            <AddNewNav active="live" />
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
          <button class="close" @click="close">
            <span class="category-name hidden-desktop">Live Video</span>
          </button>
        </div>
        <div id="videos">
          <div class="stream-video-container" id="videoleft">
            <video
              class="rounded centered"
              id="myvideo"
              autoplay=""
              muted=""
              playsinline=""
            />
          </div>
          <div id="stream-timer"></div>
          <div class="stream-online-label">live</div>
          <div class="stream-comments-wrapper">
              <div class="item">
                  <span class="avatar"><img src="https://storage.view.me/get/dev/files/8/8r/8rc/8rctzurtogg0ypfdvse0pskohyt1ukem1516938484/c320.jpg"></span>
                  <span class="name">Glance Shifter</span>
                  <span class="text">Hi, my friends</span>
              </div>
              <div class="item">
                  <span class="avatar"><img src="https://storage.view.me/get/dev/files/8/8r/8rc/8rctzurtogg0ypfdvse0pskohyt1ukem1516938484/c320.jpg"></span>
                  <span class="name">Glance Shifter</span>
                  <span class="text">Hi, my friends</span>
              </div>
              <div class="item">
                  <span class="avatar"><img src="https://storage.view.me/get/dev/files/8/8r/8rc/8rctzurtogg0ypfdvse0pskohyt1ukem1516938484/c320.jpg"></span>
                  <span class="name">Glance Shifter</span>
                  <span class="text">Hi, my friends</span>
              </div>
              <div class="item">
                  <span class="avatar"><img src="https://storage.view.me/get/dev/files/8/8r/8rc/8rctzurtogg0ypfdvse0pskohyt1ukem1516938484/c320.jpg"></span>
                  <span class="name">Glance Shifter</span>
                  <span class="text">Hi, my friends</span>
              </div>
              <div class="item">
                  <span class="avatar"><img src="https://storage.view.me/get/dev/files/8/8r/8rc/8rctzurtogg0ypfdvse0pskohyt1ukem1516938484/c320.jpg"></span>
                  <span class="name">Glance Shifter</span>
                  <span class="text">Hi, my friends</span>
              </div>
          </div>
          <form class="stream-comment-form">
              <input type="text" placeholder="Comment" class="stream-comment-input rounded lg" maxlength="24">
              <button type="button" class="stream-comment-send-btn" disabled=""></button>
          </form>
          <div class="stream-btns stream-viewer-btns">
              <span role="button" class="stream-comment-btn"></span>
              <span class="stream-like-btn"></span>
              <span class="stream-tip-btn"></span>
              <span class="stream-online-count">176</span>
          </div>
        </div>
        <div>
          Bitrate
          <select id="bitrateset">
            <option value="0">No limit</option>
            <option value="128">Cap to 128kbit</option>
            <option value="256">Cap to 256kbit</option>
            <option value="512">Cap to 512kbit</option>
            <option value="1024">Cap to 1mbit</option>
            <option value="1500">Cap to 1.5mbit</option>
            <option value="2000">Cap to 2mbit</option>
          </select>
        </div>
        <div class="mediasBottom">
          <button
            class="btn alt lg change-devices"
            @click="startStream"
          >Start live video</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import AddNewNav from "@/components/addNewNav/Index";
import userMixin from "@/mixins/user";
import Streams from "streaming-module/stream_module";
import StreamApi from "@/api/stream";
import ClickOutside from "vue-click-outside";

export default {
  name: "StreamPage",
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
      isStarted: false
    };
  },
  components: {
    Loader,
    AddNewNav
  },
  computed: {
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
    startStream() {
      this.isReadyToStart = false;
      this.isStarted = true;
      Streams.startStream();
    },
    stopStream() {
      Streams.stopStreaming();
    },
    close() {
      if (this.isStarted) {
        this.stopStream();
      } else {
        this.$router.push("/");
      }
    }
  },
  mounted() {
    this.streamVisibility =
      this.user.subscribePrice > 0
        ? this.streamVisibilities[0]
        : this.streamVisibilities[1];

    const { onDevicesReadyCallback } = this;
    const token = this.$store.state.auth.token;

    Streams.init({
      thumbEnabled: true,
      videoSave: true,
      getApiUrl: StreamApi.getStreamPath(token),
      clientGetApiUrl: "https://gpu3.view.me/webrtc-api",
      videoElId: "myvideo",
      token: (+new Date()).toString(36),
      streamSource: "client",
      showLikes: false,
      showMessage(/* message */) {
        // alert(message);
      },
      onLocalStreamInit() {},
      onRemoteStreamInit() {},
      onStreamError(error) {
        // eslint-disable-next-line
        console.error(error);
        Streams.config.onStreamEnd();
      },
      onStreamTick(/* start */) {},
      onStreamStart: room => {
        const type = this.streamVisibility.key;

        StreamApi.runStream({
          room,
          type
        })
          .then(res => {
            return res.json();
          })
          .then(({ id }) => {
            Streams.config.clientGetApiUrl = `https://team2.retloko.com/api2/v2/streams/${id}/url?access-token=${token}`;
          });
      },
      onStreamEnd: () => {
        this.isReadyToStart = true;
        this.isStarted = false;
      },
      onCleanUp() {},
      onViewersCountGet(/* count */) {},
      onCustomDataGet(/* message */) {},
      onDevicesReadyCallback
    });
  },
  beforeDestroy() {
    Streams.stopAllTracks(Streams.localStream);
  }
};
</script>
