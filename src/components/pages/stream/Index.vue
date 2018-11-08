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
            <input type="hidden" id="videoinput" value="4fff4847beac7971a37b6bb4bbada33bdee0bb47acf95b07c41fe6f1759119bd">
            <input type="hidden" id="audioinput" value="default">
            <div class="btn-media-event has-dropdown stream-visibility subscribers">
              <button type="button" class="root-btn"><span class="root-btn__inside">Subscribers only</span></button>
              <div class="menu">
                <button type="button" class="item active" data-type="subscribers"><span class="value">Subscribers only</span></button>
                <button type="button" class="item " data-type="followers"><span class="value">Followers only</span></button>
                <button type="button" class="item" data-type="public"><span class="value">Everyone</span></button>
              </div>
            </div>
            <div class="btn-media-event has-dropdown camera">
              <button type="button" class="root-btn"><span class="root-btn__inside"></span></button>
              <div class="menu">
                <button type="button" class="item" data-id=""><span class="value">Disable Camera</span></button>
              <button type="button" class="item active" data-id="4fff4847beac7971a37b6bb4bbada33bdee0bb47acf95b07c41fe6f1759119bd"><span class="value">FaceTime HD Camera</span></button></div>
            </div>
            <div class="btn-media-event has-dropdown microphone">
              <button type="button" class="root-btn"><span class="root-btn__inside"></span></button>
              <div class="menu">
                <button type="button" class="item" data-id=""><span class="value">Disable Microphone</span></button>
              <button type="button" class="item active" data-id="default"><span class="value">Default - Internal Microphone</span></button><button type="button" class="item" data-id="328cc36431a3812ace6359787ba194973764650af10e9e596cf735c11fc333a0"><span class="value">Internal Microphone</span></button></div>
            </div>
          </div>
        </div>
        <button class="close" @click="close">
          <span class="category-name hidden-desktop">Live Video</span>
        </button>
      </div>
      <div id="videos">
        <div class="stream-video-container" id="videoleft"><video class="rounded centered" id="myvideo" width="320" height="240" autoplay="" muted="" playsinline=""></video></div>
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

export default {
  name: "CreateModal",
  mixins: [userMixin],
  data: () => ({}),
  components: {
    Loader,
    AddNewNav
  },
  methods: {
    close(e) {
      e.preventDefault();
      this.$store.dispatch("modal/hide", { name: "createStory" });
    }
  }
};
</script>
