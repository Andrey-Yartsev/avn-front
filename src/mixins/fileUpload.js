import {
  getVideoPreview,
  getMediaFileMeta,
  getImagePreview,
  converterUpload,
  uniqId
} from "@/utils/mediaFiles";

import { logDebug } from "@/utils/logging";

const messages = {
  photo: "Photo limit is reached",
  video: "Video limit is reached",
  gif: "Gif limit is reached",
  audio: "Audio limit is reached"
};

const inputAcceptTypes = {
  gif: ["gif"],
  photo: ["jpg", "jpeg", "png"],
  video: ["mp4", "mov", "moov", "m4v", "mpg", "mpeg", "wmv", "avi"],
  audio: ["mp3"]
};

const limits = {
  video: 1,
  gif: 1,
  photo: 5,
  audio: 1
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
      enableS3: true,
      maxFileSizeLimit: 10000000000
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
        this.toast("Media of that type or size can not be added at this time");
      }

      let addedFiles = [...this.preloadedMedias];

      for (let i = 0; i < validLength; i += 1) {
        const file = validFiles[i];
        const { mediaType, name, size } = getMediaFileMeta(file);
        if (!this.isValidFileSize(size)) {
          return;
        }

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
          gif: addedFiles.filter(file => file.mediaType === "gif"),
          audio: addedFiles.filter(file => file.mediaType === "audio")
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
        let media = this.preloadedMedias[i];

        if (media.size < 5000000) {
          // prevent chrome freezing on large images
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

    setUploadProgress(id, loaded, total, file, logger) {
      const progress = Math.round((loaded / total) * 100);

      if (progress % 20 === 0) {
        logDebug({
          logger,
          message: "Upload progress",
          logData: {
            name: file.name,
            progress
          }
        });
      }

      this.preloadedMedias = this.preloadedMedias.map(m => {
        return m.id === id ? { ...m, loaded: progress } : m;
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
            this.setUploadProgress(
              media.id,
              e.loaded,
              e.total,
              file,
              "S3Uploader"
            );
          });

          logDebug({
            logger: "S3Uploader",
            message: "Upload started",
            logData: {
              name: file.name,
              type: file.type,
              size: file.size
            }
          });

          upload.send((error, data) => {
            if (error) {
              this.$store.dispatch("global/flashToast", {
                text: "Error while uploading",
                type: "error"
              });
              if (error.code === "RequestAbortedError") {
                logDebug({
                  logger: "S3Uploader",
                  message: "Upload aborted",
                  logData: {
                    name: file.name,
                    error
                  }
                });
                return;
              }
              delete this.s3uploads[id];
            } else {
              if (this.uploadAbortedIds.indexOf(id) !== -1) {
                this.uploadAbortedIds = this.uploadAbortedIds.filter(
                  _id => _id !== id
                );
                logDebug({
                  logger: "S3Uploader",
                  message: "Upload canceled",
                  logData: {
                    name: file.name,
                    error
                  }
                });
                return;
              }
              logDebug({
                logger: "S3Uploader",
                message: "Upload success",
                logData: {
                  name: file.name,
                  ETag: data.ETag
                }
              });
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
        ? files.filter(
            file =>
              this.isValidMediaType(file.name) &&
              file.size <= this.maxFileSizeLimit
          )
        : [];
    },

    isValidFileSize(size) {
      if (size > this.maxFileSizeLimit) {
        this.toast(`That file size can't be uploaded for now`);
        return false;
      }
      return true;
      // return size <= maxFileSizeLimit;
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
