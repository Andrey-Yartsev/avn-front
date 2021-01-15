export default {
  data() {
    return {
      isAudioRecording: false,
      timer: null,
      recorder: null,
      stream: null
    };
  },
  watch: {
    isAudioRecording(value) {
      if (value) {
        this.recordingStart();
      } else {
        this.recordingStop();
      }
    }
  },
  methods: {
    recordingStart() {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(stream => {
          this.audioStreamHandler(stream);
        });
    },
    recordingStop() {
      this.recorder.stop();
      this.stream.getTracks().forEach(function(track) {
        track.stop();
      });
      setTimeout(() => {
        this.recorder = null;
        this.stream = null;
      }, 1000);
    },
    audioStreamHandler(stream) {
      this.stream = stream;
      this.recorder = new MediaRecorder(stream);
      const audioChunks = [];
      this.recorder.addEventListener("dataavailable", e => {
        audioChunks.push(e.data);
        if (this.recorder.state == "inactive") {
          let blob = new Blob(audioChunks, { type: "audio/mpeg" });
          blob.lastModified = Date.now();
          blob.lastModifiedDate = new Date();
          blob.name = "Audio message.mp3";
          this.addMediaFiles({ target: { files: [blob] } });
        }
      });
      this.recorder.start();
    },
    audioRecording() {
      if (this.$mq === "mobile") {
        return;
      }
      if (!this.isAudioRecording) {
        this.timer = setTimeout(() => {
          this.isAudioRecording = false;
        }, 10500); // 10 seconds progressBar animation in _animation.scss
      } else {
        clearTimeout(this.timer);
      }
      this.isAudioRecording = !this.isAudioRecording;
    },
    startAudioRecording() {
      if (this.$mq === "desktop") {
        return;
      }
      this.isAudioRecording = true;
    },
    stopAudioRecording() {
      if (this.$mq === "desktop") {
        return;
      }
      this.isAudioRecording = false;
    }
  }
};
