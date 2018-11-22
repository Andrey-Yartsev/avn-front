<template>
  <div class="stream">
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
            <input type="hidden" id="videoinput" :value="streamVideo ? streamVideo.deviceId : ''">
            <input type="hidden" id="audioinput" value="default">
            <div 
              v-click-outside="hideStreamVisibilityMenu"
              :class="[
                'btn-media-event has-dropdown stream-visibility',
                streamVisibility, {
                  shown: shownStreamVisibilityMenu
                }
              ]">
              <button type="button" class="root-btn" @click="showStreamVisibilityMenu">
                <span class="root-btn__inside">{{ streamVisibilities[streamVisibility] }}</span>
              </button>
              <div class="menu">
                <button
                  type="button"
                  :data-type="key"
                  v-for="(value, key) in streamVisibilities"
                  v-bind:key="key"
                  :class="['item', { active: streamVisibility === key }]"
                  @click="() => setStreamVisibility(key)"
                >
                  <span class="value">{{ value }}</span>
                </button>
              </div>
            </div>
            <div
              class=""
              v-if="streamVideo"
              v-click-outside="hideStreamVideoMenu"
              :class="[
                'btn-media-event has-dropdown camera',
                {
                  shown: shownStreamVideoMenu,
                  'device-disabled': streamVideo.deviceId === 'disabled'
                }
              ]">
            >
              <button type="button" class="root-btn" @click="showStreamVideoMenu">
                <span class="root-btn__inside">{{ streamVideo.lavel }}</span>
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
            <div class="btn-media-event has-dropdown microphone">
              <button type="button" class="root-btn">
                <span class="root-btn__inside"></span>
              </button>
              <div class="menu">
                <button type="button" class="item" data-id="">
                  <span class="value">Disable Microphone</span>
                </button>
                <button type="button" class="item active" data-id="default">
                  <span class="value">Default - Internal Microphone</span>
                </button>
                <button type="button" class="item" data-id="328cc36431a3812ace6359787ba194973764650af10e9e596cf735c11fc333a0">
                  <span class="value">Internal Microphone</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <button class="close">
          <span class="category-name hidden-desktop">Live Video</span>
        </button>
      </div>
      <div id="videos">
        <div class="stream-video-container" id="videoleft">
          <video class="rounded centered" id="myvideo" width="320" height="240" autoplay="" muted="" playsinline="" />
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
        <button class="btn alt lg change-devices">Start live video</button>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader";
import AddNewNav from "@/components/addNewNav/Index";
import userMixin from "@/mixins/user";
import Streams from "streaming-module";
import ClickOutside from "vue-click-outside";

export default {
  name: "StreamPage",
  directives: {
    ClickOutside
  },
  mixins: [userMixin],
  data: () => ({
    streamVisibilities: {
      subscribers: "Subscribers only",
      followers: "Followers only",
      public: "Everyone"
    },
    streamVisibility: "subscribers",
    shownStreamVisibilityMenu: false,

    streamVideos: undefined,
    streamVideo: undefined,
    shownStreamVideoMenu: false,

    streamAudios: undefined,
    streamAudio: undefined,
    shownStreamAudioMenu: false
  }),
  components: {
    Loader,
    AddNewNav
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
      this.streamAudio = value;
      this.shownStreamAudioMenu = false;
    },

    onDevicesReadyCallback() {
      const {
        audioDevices,
        defaultAudioDevice,
        videoDevices,
        defaultVideoDevice
      } = Streams.getDevices();

      this.streamVideos = [
        { label: "Disable video", deviceId: "disabled" },
        ...videoDevices
      ];
      this.streamVideo = defaultVideoDevice;
      this.streamAudios = audioDevices;
      this.streamAudio = defaultAudioDevice;
    }

    // close(e) {
    //   e.preventDefault();
    //   this.$store.dispatch("modal/hide", { name: "createStory" });
    // }
  },
  mounted() {
    const { onDevicesReadyCallback } = this;

    Streams.init({
      thumbEnabled: true,
      videoSave: true,
      getApiUrl: "https://gpu3.view.me/webrtc-api",
      clientGetApiUrl: "https://gpu3.view.me/webrtc-api",
      videoElId: "myvideo",
      token: (+new Date()).toString(36),
      streamSource: "client",
      showLikes: false,
      showMessagemessage() {
        // alert(message);
      },
      onLocalStreamInit() {},
      onRemoteStreamInit() {},
      onStreamError(/* error*/) {
        // alert(error);
        Streams.config.onStreamEnd();
      },
      onStreamTick(/* start */) {},
      onStreamStart(/* roomName) {},
      onStreamEnd() {},
      onCleanUp() {},
      onViewersCountGet(/* count */) {},
      onCustomDataGet(/* message */) {},
      onDevicesReadyCallback
    });
  }
};
</script>
