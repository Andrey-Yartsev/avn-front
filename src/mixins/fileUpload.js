import { getMediaFilePreview, fileUpload, uniqId } from "@/utils/mediaFiles";

export default {
  data() {
    return {
      preloadedMedias: []
    };
  },

  methods: {
    addMediaFiles: async function(e) {
      const files = e.target.files;

      if (!files.length) return;

      const addedFiles = [...this.preloadedMedias];

      for (let i = 0; i < files.length; i += 1) {
        const preview = await getMediaFilePreview(files[i]);

        addedFiles.push({
          file: files[i],
          userFileName: files[i].name,
          preview: preview.preview,
          mediaType: preview.mediaType,
          id: uniqId(),
          loaded: 0
        });
      }

      const photos = addedFiles.filter(file => file.mediaType === "photo");
      const videos = addedFiles.filter(file => file.mediaType === "video");

      e.target.value = "";

      if (photos.length && videos.length) {
        this.$store.dispatch(
          "global/flashToast",
          "You can't add more than one video",
          {
            root: true
          }
        );
        this.preloadedMedias = [...photos];
        return;
      }

      if (videos.length > 1) {
        this.$store.dispatch(
          "global/flashToast",
          "You can't add more than one video",
          {
            root: true
          }
        );
        this.preloadedMedias = [videos[0]];
        return;
      }

      this.preloadedMedias = [...addedFiles];
    },

    removeMedia(id) {
      this.preloadedMedias = this.preloadedMedias.filter(m => m.id !== id);
    },

    setUploadProgress(id, loaded, total) {
      this.preloadedMedias = this.preloadedMedias.map(
        m => (m.id === id ? { ...m, loaded: (loaded / total) * 100 } : m)
      );
    },

    async getMediaFiles() {
      const promises = this.preloadedMedias.map(({ id, file }) =>
        fileUpload({ id, file }, this.setUploadProgress)
      );

      return await Promise.all(promises);
    }
  }
};
