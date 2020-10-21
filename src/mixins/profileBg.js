import upload from "@/utils/upload";
import { getImagePreview } from "@/utils/mediaFiles";

export default {
  data() {
    return {
      bgPreview: null,
      bgUploading: false,
      bgRemoved: false,
      gettingBgPreview: false,
      hideInput: false
    };
  },
  computed: {
    showBgSave() {
      return this.bgPreview && !this.bgUploading && !this.hideInput;
    },
    hideBgAdd() {
      return this.bgPreview || this.bgUploading;
    }
  },
  methods: {
    setBgPreview(e) {
      console.log(e.target.files[0]);
      this.bgRemoved = false;
      this.hideInput = false;
      this.gettingBgPreview = true;
      getImagePreview({ file: e.target.files[0] }, ({ preview }) => {
        this.bgPreview = preview;
        this.gettingBgPreview = false;
      });
    },
    resetBgPreview() {
      this.bgPreview = null;
      if (this.$refs.bgAside) {
        this.$refs.bgAside.value = "";
      }
    },
    saveBg({ isClear, refName }) {
      return new Promise(accept => {
        this.bgUploading = true;
        this.hideInput = true;
        upload(this.$refs[refName].files[0])
          .then(fileName => {
            this.$store
              .dispatch("profile/extend", {
                header: fileName
              })
              .then(() => {
                if (isClear === true) {
                  this.bgPreview = "";
                }
                this.bgUploading = false;
                accept();
              });
          })
          .catch(e => {
            this.$store.dispatch("global/flashToast", {
              text: e.message && e.message,
              type: "error"
            });

            this.bgPreview = "";
            this.hideInput = false;
            this.bgUploading = false;
            this.$refs[refName].value = "";
          });
      });
    },
    removeBg() {
      this.bgRemoved = true;
      this.bgPreview = "";
      this.$store
        .dispatch("profile/extend", {
          header: ""
        })
        .then(() => {
          this.resetBgPreview();
        });
    }
  }
};
