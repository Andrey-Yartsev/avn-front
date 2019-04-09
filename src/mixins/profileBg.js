import upload from "@/utils/upload";
import { getImagePreview } from "@/utils/mediaFiles";

export default {
  data() {
    return {
      bgPreview: null,
      bgUploading: false,
      bgRemoved: false
    };
  },
  computed: {
    showBgSave() {
      return this.bgPreview && !this.bgUploading;
    },
    showBgAdd() {
      return !this.bgPreview && !this.bgUploading;
    }
  },
  methods: {
    setBgPreview(e) {
      this.bgRemoved = false;
      getImagePreview({ file: e.target.files[0] }, ({ preview }) => {
        this.bgPreview = preview;
      });
    },
    resetBgPreview() {
      this.bgPreview = null;
      this.$refs.bg.value = "";
    },
    saveBg(clear) {
      return new Promise(accept => {
        this.bgUploading = true;
        upload(this.$refs.bg.files[0]).then(fileName => {
          this.$store
            .dispatch("profile/extend", {
              header: fileName
            })
            .then(() => {
              if (clear === true) {
                this.bgPreview = "";
              }
              this.bgUploading = false;
              accept();
            });
        });
      });
    },
    removeBg() {
      this.bgRemoved = true;
      this.bgPreview = "";
      this.$store.dispatch("profile/extend", {
        header: ""
      });
    }
  }
};
