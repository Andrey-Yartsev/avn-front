export default {
  props: {
    media: {
      type: Object,
      required: true
    },
    postId: {
      type: Number,
      default: undefined
    },
    openModal: {
      type: Function,
      default: () => {}
    },
    mediaSize: {
      type: String,
      default: "full"
    }
  },
  computed: {
    src() {
      if (this.mediaSize === "full") {
        return this.media.src.source;
      }

      if (this.mediaSize === "preview") {
        return this.media.preview.source;
      }

      if (this.mediaSize === "thumb") {
        return this.media.thumb.source;
      }
    }
  }
};
