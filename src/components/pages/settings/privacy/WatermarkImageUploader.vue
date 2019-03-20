<template>
  <div class="form-group form-group_with-label pb-reset">
    <div
      class="form-group-inner photo-form-group-inner"
      :class="{ success: uploaded }"
    >
      <span class="label">Watermark image</span>

      <div class="photo-label-wrapper">
        <div class="photo-label">
          <label for="photo" class="btn lg photo-btn">
            Choose
            <input
              type="file"
              id="photo"
              accept=".jpg,.jpeg,.png"
              ref="photo"
              @change="change"
            />
          </label>
        </div>
        <div class="watermark-picture" v-if="preview">
          <div class="watermark-picture__remove" @click="preview = ''">
            <svg aria-hidden="true" class="icn icn-remove">
              <use xlink:href="#icon-remove"></use>
            </svg>
          </div>
          <img :src="preview" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import upload from "@/utils/upload";

export default {
  name: "WatermarkImageUploader",
  data() {
    return {
      uploaded: false,
      preview: null
    };
  },
  computed: {
    error() {
      return this.$store.state.profile.error;
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
      this.save();
      this.setPreview(e);
    },
    async save() {
      try {
        const fileName = await upload(this.$refs.photo.files[0]);
        this.$emit("change", fileName);
      } catch (error) {
        this.$store.dispatch("global/flashToast", error.message);
        this.preview = null;
      }
    },
    setPreview(e) {
      const reader = new FileReader();
      reader.onload = () => {
        this.preview = reader.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }
};
</script>
