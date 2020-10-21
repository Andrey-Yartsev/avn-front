import upload from "@/utils/upload";
import { getImagePreview } from "@/utils/mediaFiles";

export default {
  data() {
    return {
      avatarPreview: null,
      avatarUploading: false,
      avatarRemoved: false,
      gettingPreview: false
    };
  },
  computed: {
    showAvatarSave() {
      return this.avatarPreview && !this.avatarUploading;
    },
    showAvatarAdd() {
      return !this.avatarPreview && !this.avatarUploading;
    }
  },
  methods: {
    setAvatarPreview(e) {
      if (!e.target.files || !e.target.files.length) {
        return;
      }

      this.avatarRemoved = false;
      this.gettingPreview = true;

      getImagePreview({ file: e.target.files[0] }, ({ preview }) => {
        this.avatarPreview = preview;
        this.gettingPreview = false;
      });
    },
    resetAvatarPreview() {
      this.avatarPreview = null;
      this.$refs.avatar.value = "";
    },
    saveAvatar() {
      return new Promise(accept => {
        this.avatarUploading = true;
        console.log(">>>", this.$refs.avatar.files[0]);
        upload(this.$refs.avatar.files[0])
          .then(fileName => {
            console.log("fileName", fileName);
            this.$store
              .dispatch("profile/extend", {
                avatar: fileName
              })
              .then(() => {
                this.avatarPreview = "";
                this.avatarUploading = false;
                accept();
              });
          })
          .catch(e => {
            this.$store.dispatch("global/flashToast", {
              text: e.message && e.message,
              type: "error"
            });

            this.avatarPreview = "";
            this.avatarUploading = false;
            this.$refs.avatar.value = "";
          });
      });
    },
    removeAvatar() {
      this.avatarRemoved = true;
      this.avatarPreview = "";
      this.$store
        .dispatch("profile/extend", {
          avatar: ""
        })
        .then(() => {
          this.resetAvatarPreview();
        });
    }
  }
};
