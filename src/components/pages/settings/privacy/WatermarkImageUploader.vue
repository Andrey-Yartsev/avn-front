<template>
  <div class="form-group form-group_with-label pb-reset">
    <div
      class="form-group-inner photo-form-group-inner"
      :class="{ 'success icn-item': uploaded }"
    >
      <span class="label">Watermark image</span>

      <div class="photo-label-wrapper">
        <label
          for="photo"
          class="btn btn_fix-width-sm btn_block border photo-btn"
        >
          {{ buttonTitle }}
          <input
            type="file"
            id="photo"
            accept=".jpg,.jpeg,.png"
            ref="photo"
            @change="change"
          />
        </label>
        <div class="watermark-picture" v-if="picture">
          <div class="watermark-picture__remove" @click="remove">
            <svg aria-hidden="true" class="icn icn-remove">
              <use xlink:href="#icon-remove"></use>
            </svg>
          </div>
          <img :src="picture" />
        </div>
      </div>
      <div class="input-help hint-text-sm">
        Required both width and height from 100px to 300px
      </div>
    </div>
  </div>
</template>

<script>
import upload from "@/utils/upload";
import { getImagePreview } from "@/utils/mediaFiles";

export default {
  name: "WatermarkImageUploader",
  props: {
    localUser: Object
  },
  data() {
    return {
      uploading: false,
      uploaded: false,
      preview: null
    };
  },
  computed: {
    error() {
      return this.$store.state.profile.error;
    },
    buttonTitle() {
      return this.uploading ? "Uploading" : "Choose";
    },
    picture() {
      if (this.localUser.watermarkFile) {
        if (this.localUser.watermarkFile.match(/\/upload.*/)) {
          return this.preview;
        }
        return this.localUser.watermarkFile;
      }
      return this.preview;
    }
  },
  watch: {
    error(error) {
      if (error) {
        this.preview = null;
      }
    }
  },
  methods: {
    change(e) {
      if (e.target.files && e.target.files.length) {
        getImagePreview(
          { file: e.target.files[0] },
          ({ preview, params: { width, height } }) => {
            if (
              width >= 100 &&
              width <= 300 &&
              height >= 100 &&
              height <= 300
            ) {
              this.preview = preview;
              this.save();
            } else {
              this.$store.dispatch("global/flashToast", {
                text: "Required both width and height from 100px to 300px",
                type: "error"
              });
            }
          }
        );
      }
    },
    async save() {
      this.uploaded = false;
      this.uploading = true;
      try {
        const fileName = await upload(this.$refs.photo.files[0], "watermark");
        this.uploaded = true;
        this.$emit("change", fileName);
      } catch (error) {
        this.$store.dispatch("global/flashToast", {
          text: error.message,
          type: "error"
        });
        this.preview = null;
      }
      this.uploading = false;
    },
    remove() {
      this.preview = null;
      this.uploaded = false;
      this.$refs.photo.value = "";
      this.$emit("remove");
    }
  }
};
</script>
