import upload from "@/utils/upload";

export default {
  data() {
    return {
      avatarPreview: null,
      avatarUploading: false,
      avatarRemoved: false
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
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    },
    resetAvatarPreview() {
      this.avatarPreview = null;
    },
    saveAvatar() {
      return new Promise(accept => {
        this.avatarUploading = true;
        upload(this.$refs.avatar.files[0]).then(fileName => {
          this.$store
            .dispatch("profile/extend", {
              avatar: fileName
            })
            .then(() => {
              this.avatarPreview = "";
              this.avatarUploading = false;
              accept();
            });
        });
      });
    },
    removeAvatar() {
      this.avatarRemoved = true;
      this.avatarPreview = "";
      this.$store.dispatch("profile/extend", {
        avatar: ""
      });
    }
  }
};
