<template>
  <Modal :onClose="close">
    <template slot="content">
      <div id="stream">
        <div id="stream-timer">{{ time }}</div>
        <div class="stream-online-label">live</div>
        <span role="button" id="close-stream-window" @click="stopWatching" />
        <video id="remotevideo" width="320" height="240" playsinline="" autoplay=""></video>
      </div>
    </template>
  </Modal>
</template>
<script>
import Loader from "@/components/common/Loader";
import Modal from "@/components/modal/Index";
import Streams from "streaming-module/view_module";
import StreamApi from "@/api/stream";

export default {
  name: "ViewStremModal",
  components: {
    Modal,
    Loader
  },
  data: () => ({
    loading: true,
    time: undefined,
    shouldUpdateTimer: false
  }),
  methods: {
    stopWatching() {
      Streams.stopStream(false, true);
      // Послать веб сокет что я перестал смотреть
      this.close();
    },
    updateTimer() {
      const start = new Date(
        this.$store.state.modal.stream.data.stream.startedAt
      );
      const diff = Date.now() - start;
      const date = new Date(diff);
      let hours = date.getHours();
      let mins = date.getMinutes();
      let secs = date.getSeconds();
      hours = hours < 10 ? `0${hours}` : `${hours}`;
      mins = mins < 10 ? `0${mins}` : `${mins}`;
      secs = secs < 10 ? `0${secs}` : `${secs}`;
      this.time =
        diff > 3600 ? hours + ":" + mins + ":" + secs : mins + ":" + secs;

      if (!this.shouldUpdateTimer) return;

      setTimeout(() => {
        this.updateTimer();
      }, 1000);
    },
    close() {
      this.$store.dispatch("modal/hide", {
        name: "stream"
      });
      location.reload();
    }
  },
  mounted() {
    const token = this.$store.state.auth.token;
    const id = this.$store.state.modal.stream.data.stream.id;
    Streams.config.getApiUrl = StreamApi.getStreamClientPath(id, token);
    Streams.config.remoteVideo = document.getElementById("remotevideo");
    Streams.viewStream();
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
          alert("Live video has ended");
        }

        if (isError) {
          alert("An error was happened");
        }

        this.close();
      },

      onStreamInit: function() {
        // document.getElementById("view-stream").classList.add("hidden");
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
  }
};
</script>
