import {
  getVideoPreview,
  getMediaFileMeta,
  getImagePreview,
  converterUpload,
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
      uploadInProgress: false,
      uploadAbortedIds: [],
      s3uploads: {},
      enableS3: true
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
      if (this.uploadInProgress) {
        this.s3uploads[id].abort();
        delete this.s3uploads[id];
        this.uploadAbortedIds.push(id);
      }
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
            : converterUpload(
                { id, file, width, mediaType },
                this.setUploadProgress
              )
      );

      return await Promise.all(promises);
    },

    getS3Upload(file) {
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

      return new global.AWS.S3.ManagedUpload({
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
    },

    s3Upload(media) {
      const { id, mediaType, file } = media;

      return new Promise(accept => {
        if (this.enableS3) {
          const upload = this.getS3Upload(file);
          this.s3uploads[id] = upload;

          upload.on("httpUploadProgress", e => {
            this.setUploadProgress(media.id, e.loaded, e.total);
          });

          upload.send((err, data) => {
            if (err) {
              this.$store.dispatch("global/flashToast", {
                text: "Error while uploading",
                type: "error"
              });
              delete this.s3uploads[id];
            } else {
              if (this.uploadAbortedIds.indexOf(id) !== -1) {
                this.uploadAbortedIds = this.uploadAbortedIds.filter(
                  _id => _id !== id
                );
                return;
              }
              converterUpload(
                { id, mediaType, file: data },
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
                delete this.s3uploads[id];
                accept();
              });
            }
          });
        } else {
          converterUpload(
            { id, mediaType, file },
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
