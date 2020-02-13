import {
  getVideoPreview,
  getMediaFileMeta,
  getImagePreview,
  fileUpload,
  uniqId
} from "@/utils/mediaFiles";

const messages = {
  photo: "Photo limit is reached",
  video: "Video limit is reached",
  gif: "Gif limit is reached"
};

const inputAcceptTypes = {
  gif: ["gif"],
  photo: ["jpg", "jpeg", "png"],
  video: ["mp4", "mov", "moov", "m4v", "mpg", "mpeg", "wmv", "avi"]
};

const limits = {
  video: 1,
  gif: 1,
  photo: 5
};

export default {
  data() {
    return {
      preloadedMedias: [],
      inputAcceptTypes,
      limits: (this.$props && this.$props.defaultLimits) || limits,
      uploadInProgress: false
    };
  },

  computed: {
    getAcceptedFormats() {
      return this.$props.videosOnly
        ? ".mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi"
        : ".jpg,.jpeg,.gif,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi";
    }
  },

  methods: {
    addMediaFiles: async function(e) {
      const files = Array.from(e.target.files);
      const innerLength = files.length;
      if (!innerLength) return;

      const validFiles = this.validateFiles(files);
      const validLength = validFiles.length;

      if (validLength < innerLength) {
        if (!e.target.multiple) {
          e.target.value = "";
        }
        this.toast("Media of that type can not be added at this time");
      }

      let addedFiles = [...this.preloadedMedias];

      for (let i = 0; i < validLength; i += 1) {
        const file = validFiles[i];
        const { mediaType, name, size } = getMediaFileMeta(file);

        addedFiles.push({
          file,
          mediaType,
          userFileName: name,
          id: uniqId() + i,
          loaded: 0,
          size
        });
      }

      if (!addedFiles.length) return;

      if (this.allowMultipleFileTypes) {
        this.preloadedMedias = [...addedFiles];
      } else {
        this.mediaType = addedFiles[0].mediaType;

        const filtered = {
          photo: addedFiles.filter(file => file.mediaType === "photo"),
          video: addedFiles.filter(file => file.mediaType === "video"),
          gif: addedFiles.filter(file => file.mediaType === "gif")
        };

        e.target.value = "";

        if (filtered[this.mediaType].length > this.limits[this.mediaType]) {
          this.toast(messages[this.mediaType]);
        }

        this.preloadedMedias = [
          ...filtered[this.mediaType].splice(0, this.limits[this.mediaType])
        ];
      }

      for (let i = 0; i < this.preloadedMedias.length; i += 1) {
        const media = this.preloadedMedias[i];
        const getPreviewMethod =
          media.mediaType === "video" ? getVideoPreview : getImagePreview;

        if (media.alreadySaved) {
          continue;
        }

        getPreviewMethod(media, newMedia => {
          this.preloadedMedias = this.preloadedMedias.map(oldMedia =>
            oldMedia.id === newMedia.id ? newMedia : oldMedia
          );
        });
      }

      this.saveMediaFiles();
    },

    removeMedia(id) {
      this.preloadedMedias = this.preloadedMedias.reduce((memo, media) => {
        if (media.id !== id) {
          return [...memo, media];
        } else {
          if (media.res && media.res.abort) {
            media.res.abort();
          }
          return memo;
        }
      }, []);

      this.mediaType = this.preloadedMedias.length
        ? this.preloadedMedias[0].mediaType
        : "all";
    },

    setUploadProgress(id, loaded, total) {
      this.preloadedMedias = this.preloadedMedias.map(m => {
        return m.id === id
          ? { ...m, loaded: Math.round((loaded / total) * 100) }
          : m;
      });
    },

    async getMediaFiles() {
      const promises = this.preloadedMedias.map(
        ({ id, file, width, mediaType, alreadySaved }) =>
          alreadySaved
            ? id
            : fileUpload({ id, file, width, mediaType }, this.setUploadProgress)
      );

      return await Promise.all(promises);
    },

    s3Upload(media) {
      const { id, file, width, mediaType } = media;

      return new Promise(accept => {
        const {
          bucketName,
          uploadPath,
          accessKeyId,
          secretAccessKey
        } = this.$store.state.init.data.upload;

        const s3 = new global.AWS.S3({
          apiVersion: "2006-03-01",
          params: {
            Bucket: bucketName
          },
          useAccelerateEndpoint: true,
          accessKeyId,
          secretAccessKey,
          correctClockSkew: true,
          httpOptions: {
            timeout: 0
          },
          maxRetries: 1000000
        });

        const upload = new global.AWS.S3.ManagedUpload({
          params: {
            Bucket: bucketName,
            Key:
              uploadPath +
              "/" +
              new Date().getTime() +
              "/" +
              encodeURIComponent(file.name),
            Body: file,
            ContentType: file.type,
            ContentDisposition: "inline"
          },
          service: s3,
          queueSize: 8
        });
        upload.on("httpUploadProgress", e => {
          this.setUploadProgress(media.id, e.loaded, e.total);
        });
        upload.send(err => {
          if (err) {
            // err.code === 'RequestAbortedError'
            // console.log("Error: [" + err.code + "] " + err.message);
          } else {
            fileUpload(
              { id, file, width, mediaType },
              this.setUploadProgress,
              this.withoutWatermark
            ).then(({ processId, thumbs }) => {
              this.preloadedMedias = this.preloadedMedias.map(m =>
                m.id === id ? { ...m, processId, thumbs, thumbId: 1 } : m
              );
              this.uploadInProgress = false;
              if (this.setMediaIsReady !== undefined) {
                this.setMediaIsReady(processId);
              }
              accept();
            });
          }
        });
      });
    },

    saveMediaFiles() {
      this.uploadInProgress = true;

      this.preloadedMedias = this.preloadedMedias.map(media => {
        if (media.processId || media.loaded) {
          return { ...media };
        }

        this.s3Upload(media);

        return { ...media };
      });
    },

    validateFiles(files) {
      return files.length
        ? files.filter(file => this.isValidMediaType(file.name))
        : [];
    },

    isValidMediaType(name) {
      const fileExt = name
        .split(".")
        .pop()
        .toLowerCase();

      return this.allMediaTypes.indexOf(fileExt) !== -1;
    },

    toast(text) {
      this.$store.dispatch("global/flashToast", { text }, { root: true });
    }
  }
};
