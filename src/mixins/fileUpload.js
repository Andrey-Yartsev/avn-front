import {
  getMediaFilePreview,
  getMediaFileMeta,
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
      limits
    };
  },

  methods: {
    addMediaFiles: async function(e) {
      const files = Array.from(e.target.files);
      const innerLength = files.length;

      if (!innerLength) return;

      const validFiles = this.validateFiles(files);
      const validLength = validFiles.length;

      if (validLength < innerLength) {
        this.toast("Media of that type can not be added at this time");
      }

      let addedFiles = [...this.preloadedMedias];

      for (let i = 0; i < validLength; i += 1) {
        const file = validFiles[i];
        const {
          mediaType,
          preview,
          fileContent,
          width
        } = await getMediaFileMeta(file);

        addedFiles.push({
          width,
          file,
          mediaType,
          fileContent,
          userFileName: file.name,
          preview,
          id: uniqId(),
          loaded: 0
        });
      }

      if (!addedFiles.length) return;

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

      for (let i = 0; i < this.preloadedMedias.length; i += 1) {
        const media = this.preloadedMedias[i];

        if (media.mediaType === "video" && !media.preview) {
          getMediaFilePreview(media, newMedia => {
            this.preloadedMedias = this.preloadedMedias.map(oldMedia =>
              oldMedia.id === newMedia.id ? newMedia : oldMedia
            );
          });
        }
      }

      this.saveMediaFiles();
    },

    removeMedia(id) {
      this.preloadedMedias = this.preloadedMedias.filter(m => m.id !== id);
      this.mediaType = this.preloadedMedias.length
        ? this.preloadedMedias[0].mediaType
        : "all";
    },

    setUploadProgress(id, loaded, total) {
      this.preloadedMedias = this.preloadedMedias.map(m =>
        m.id === id ? { ...m, loaded: (loaded / total) * 100 } : m
      );
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

    saveMediaFiles() {
      this.preloadedMedias
        .filter(i => !i.processId && !i.loaded)
        .forEach(media => {
          const { id, file, width, mediaType } = media;
          fileUpload({ id, file, width, mediaType }, this.setUploadProgress)
            .then(processId => {
              this.preloadedMedias = this.preloadedMedias.map(m =>
                m.id === id ? { ...m, processId } : m
              );
            })
            .catch(() => {
              this.preloadedMedias = this.preloadedMedias.map(m =>
                m.id === id ? { ...m, uploadError: true } : m
              );
              this.toast("Can't upload file");
            });
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
    }
  }
};
