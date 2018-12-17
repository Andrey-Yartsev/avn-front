<template>
  <Modal :onClose="close">
    <template slot="content">
      <div id="stream">
        <div id="stream-timer">{{ time }}</div>
        <div class="stream-online-label">live</div>
        <span role="button" id="close-stream-window" @click="stopWatching" />
        <div class="likesContainer">
          <div v-for="like in likes" :id="like.date" :key="like.date" class="like" :style="{ top: `${like.y}px`, left: `${like.x}px`}">
            <div class='like-icon'><div class='like-icon__symbol' /></div>
          </div>
        </div>
        <video id="remotevideo" width="320" height="240" playsinline="" autoplay="" @click="click"></video>
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
          <span class="stream-like-btn" @click="throttledLike"></span>
          <span class="stream-tip-btn" v-if="false"></span>
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
import Streams from "streaming-module/view_module";
import StreamApi from "@/api/stream";
import moment from "moment";

export default {
  name: "ViewStremModal",
  components: {
    Modal,
    Loader
  },
  data: () => ({
    loading: true,
    time: undefined,
    shouldUpdateTimer: false,
    streamIsFinished: false,
    likes: [],
    newComment: "",
    showCommentForm: false
  }),
  computed: {
    throttledLike() {
      return throttle(300, this.like);
    },
    comments() {
      return this.$store.state.lives.currentLive.comments;
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

      var ms = moment().diff(
        moment(this.$store.state.modal.stream.data.stream.startedAt)
      );
      var delta = moment.duration(ms);

      this.time =
        delta > 60 * 60 * 1000
          ? moment(delta, "ss.SSS").format("hh:mm:ss")
          : moment(delta, "ss.SSS").format("mm:ss");

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
      showMessage: function(message) {
        alert(message);
      },
      onStreamEnd: (isError, isClient) => {
        this.shouldUpdateTimer = false;
        this.time = undefined;

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

      onSetupStreamingSession: function() {
        // var videoControls = document.getElementById("video-controls");
        // document.getElementById("close-stream").classList.remove("hidden");
        // document.getElementById("streamer-status").classList.remove("hidden");
        // videoControls.classList.remove("hidden");
        // var stream = document.getElementById("videowrap");
        // stream.classList.remove("hidden");
        // // No remote video yet
        // stream.insertAdjacentHTML(
        //   "beforeend",
        //   "<video id=waitingvideo width=320 height=240 />"
        // );
        // var video = Streams.config.remoteVideo;
        // if (video.canPlayType) {
        //   var videoContainer = document.getElementById("videoContainer");
        //   if (Streams.isMobile) {
        //     video.controls = true;
        //     videoControls.classList.add("hidden");
        //   }
        //   var playpause = document.getElementById("playpause");
        //   var fullscreen = document.getElementById("fs");
        //   //Play/pause
        //   playpause.addEventListener("click", function(e) {
        //     if (video.paused || video.ended) video.play();
        //     else video.pause();
        //   });
        //   //Volume
        //   var volume = document.getElementById("volume");
        //   volume.oninput = function() {
        //     video.volume = this.value;
        //   };
        //   //Fullscreen
        //   fs.addEventListener("click", function(e) {
        //     handleFullscreen();
        //   });
        //   // Check if the browser supports the Fullscreen API
        //   var fullScreenEnabled = !!(
        //     document.fullscreenEnabled ||
        //     document.mozFullScreenEnabled ||
        //     document.msFullscreenEnabled ||
        //     document.webkitSupportsFullscreen ||
        //     document.webkitFullscreenEnabled ||
        //     document.createElement("video").webkitRequestFullScreen
        //   );
        //   // If the browser doesn't support the Fulscreen API then hide the fullscreen button
        //   if (!fullScreenEnabled) {
        //     fullscreen.style.display = "none";
        //   }
        //   // Set the video container's fullscreen state
        //   var setFullscreenData = function(state) {
        //     videoContainer.setAttribute("data-fullscreen", !!state);
        //   };
        //   // Checks if the document is currently in fullscreen mode
        //   var isFullScreen = function() {
        //     return !!(
        //       document.fullScreen ||
        //       document.webkitIsFullScreen ||
        //       document.mozFullScreen ||
        //       document.msFullscreenElement ||
        //       document.fullscreenElement
        //     );
        //   };
        //   var handleFullscreen = function() {
        //     // If fullscreen mode is active...
        //     if (isFullScreen()) {
        //       // ...exit fullscreen mode
        //       // (Note: this can only be called on document)
        //       if (document.exitFullscreen) document.exitFullscreen();
        //       else if (document.mozCancelFullScreen)
        //         document.mozCancelFullScreen();
        //       else if (document.webkitCancelFullScreen)
        //         document.webkitCancelFullScreen();
        //       else if (document.msExitFullscreen) document.msExitFullscreen();
        //       setFullscreenData(false);
        //     } else {
        //       // ...otherwise enter fullscreen mode
        //       // (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
        //       if (videoContainer.requestFullscreen)
        //         videoContainer.requestFullscreen();
        //       else if (videoContainer.mozRequestFullScreen)
        //         videoContainer.mozRequestFullScreen();
        //       else if (videoContainer.webkitRequestFullScreen) {
        //         // Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and
        //         // ensures that our custom controls are visible:
        //         // figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
        //         // figure[data-fullscreen=true] .controls { z-index:2147483647; }
        //         video.webkitRequestFullScreen();
        //       } else if (videoContainer.msRequestFullscreen)
        //         videoContainer.msRequestFullscreen();
        //       setFullscreenData(true);
        //     }
        //     // Listen for fullscreen change events (from other controls, e.g. right clicking on the video itself)
        //     document.addEventListener("fullscreenchange", function(e) {
        //       setFullscreenData(
        //         !!(document.fullScreen || document.fullscreenElement)
        //       );
        //     });
        //     document.addEventListener("webkitfullscreenchange", function() {
        //       setFullscreenData(!!document.webkitIsFullScreen);
        //     });
        //     document.addEventListener("mozfullscreenchange", function() {
        //       setFullscreenData(!!document.mozFullScreen);
        //     });
        //     document.addEventListener("msfullscreenchange", function() {
        //       setFullscreenData(!!document.msFullscreenElement);
        //     });
        //  };
        // }
      },

      onStreamError: function(error) {
        // viewModule.config.remoteVideo.classList.add("hidden");
        // document.getElementById("view-stream").classList.remove("hidden");
        // document.getElementById("close-stream").classList.add("hidden");
        // document.getElementById("streamer-status").classList.add("hidden");
        // document.getElementById("video-controls").classList.add("hidden");
        alert(error);
      },

      onRemoteVideoUnavailable: function() {
        // viewModule.config.remoteVideo.classList.add("hidden");
        alert("No remote video available");
      },

      onInit: function() {
        // document
        //   .getElementById("view-stream")
        //   .addEventListener("click", function() {
        //     viewModule.viewStream();
        //   });
        // document
        //   .getElementById("close-stream")
        //   .addEventListener("click", function() {
        //     viewModule.stopStream(false, true);
        //     viewModule.config.remoteVideo.classList.add("hidden");
        //   });
        // document
        //   .getElementById("mute-audio")
        //   .addEventListener("click", function() {
        //     viewModule.muteAudio();
        //   });
        // document
        //   .getElementById("unmute-audio")
        //   .addEventListener("click", function() {
        //     viewModule.unmuteAudio();
        //   });
        // if (viewModule.config.showLikes) {
        //   viewModule.config.remoteVideo.addEventListener(
        //     viewModule.isMobile ? "touchstart" : "click",
        //     function(event) {
        //       var videoSize = event.currentTarget.getBoundingClientRect();
        //       var xPos = event.clientX;
        //       var yPos = event.clientY;
        //       if (viewModule.isMobile) {
        //         xPos = event.pageX;
        //         yPos = event.pageY;
        //       }
        //       var x = xPos - videoSize.left;
        //       var y = yPos - videoSize.top;
        //       var width = videoSize.width;
        //       var height = videoSize.height;
        //       var percentHorizontally = (100 * x) / width;
        //       var percentVertical = (100 * y) / height;
        //       viewModule.sendCustomMessage({
        //         msgtype: "data.custom",
        //         to: ["streamer", "transcoder"],
        //         data: {
        //           type: "click.position",
        //           position: {
        //             x: percentHorizontally,
        //             y: percentVertical
        //           }
        //         }
        //       });
        //       var id = (+new Date()).toString(36);
        //       var div =
        //         "<div id='" +
        //         id +
        //         "' class='like' style='top: " +
        //         percentVertical +
        //         "%;left: " +
        //         percentHorizontally +
        //         "%;'><div class='like-icon'><div class='like-icon__symbol'></div></div></div>";
        //       document
        //         .getElementById("videowrap")
        //         .insertAdjacentHTML("beforeend", div);
        //       setTimeout(function() {
        //         document.getElementById(id).remove();
        //       }, 5000);
        //     }
        //   );
        // }
      },

      onVideoPlaying: () => {
        this.shouldUpdateTimer = true;
        this.updateTimer();
        // document.getElementById("waitingvideo") &&
        //   document.getElementById("waitingvideo").remove();
        // if (viewModule.config.remoteVideo.videoWidth) {
        //   document.getElementById("videowrap").classList.remove("hidden");
        //   viewModule.config.remoteVideo.classList.remove("hidden");
        //   var viewport_meta = document.querySelector("meta[name='keywords']");
        //   if (viewport_meta) {
        //     var content = viewport_meta.getAttribute("content");
        //     viewport_meta.setAttribute(
        //       "content",
        //       content + ", user-scalable=no"
        //     );
        //     viewport_meta.setAttribute("data-content", content);
        //   }
        // }
      },

      onCleanUp: function() {
        // document.getElementById("videowrap").classList.add("hidden");
      },

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
    this.shouldUpdateTimer = false;
    window.clearInterval(this.likesInterval);
  }
};
</script>
