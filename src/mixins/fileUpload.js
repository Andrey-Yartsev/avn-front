import { getMediaFilePreview, uniqId } from "@/utils/mediaFiles";

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

      for (let i = 0; i < files.length; i += 1) {
        const preview = await getMediaFilePreview(files[i]);

        this.preloadedMedias.push({
          file: files[i],
          userFileName: files[i].name,
          preview: preview.preview,
          id: uniqId(),
          loaded: 0
        });
      }

      e.target.value = "";
    },

    removePostMedia(id) {
      this.preloadedMedias = this.preloadedMedias.filter(m => m.id !== id);
    },

    setUploadProgress(id, loaded, total) {
      this.preloadedMedias = this.preloadedMedias.map(
        m => (m.id === id ? { ...m, loaded: (loaded / total) * 100 } : m)
      );
    }
  }
};
