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
      const file = e.target.files[0];
      const imageType = /image.*/;
      if (file.type.match(imageType)) {
        const reader = new FileReader();
        reader.onload = () => {
          this.bgPreview = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert("File not supported!");
      }
    },
    resetBgPreview() {
      this.bgPreview = null;
    },
    saveBg() {
      this.bgUploading = true;
      const file = this.$refs.bg.files[0];
      const formData = new FormData();
      formData.append("file", file);
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        process.env.VUE_APP_API_URL +
          "/upload?access-token=" +
          this.$store.state.auth.token,
        true
      );
      xhr.onload = e => {
        const result = JSON.parse(e.currentTarget.responseText);
        this.$store
          .dispatch("profile/extend", {
            header: result[0].fileName
          })
          .then(() => {
            this.bgPreview = "";
            this.bgUploading = false;
          });
      };
      xhr.send(formData);
    },
    removeBg() {
      if (!confirm("Are you sure?")) {
        return;
      }
      this.bgRemoved = true;
      this.bgPreview = "";
      this.$store.dispatch("profile/extend", {
        header: ""
      });
    }
  }
};
