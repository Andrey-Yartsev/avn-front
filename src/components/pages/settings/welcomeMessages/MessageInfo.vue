<template>
  <div class="payouts-personal-info">
    <div
      class="form-group form-group_clear-gaps-bottom form-group_with-label item"
    >
      <span class="title title-top">Message</span>
      <span
        class="value"
        :class="{ editMode: isEdit, mobile: $mq === 'mobile' }"
      >
        <textarea v-if="isEdit" type="text" rows="4" v-model="info.text" />
        <span v-else class="value__text">
          {{ info.text }}
        </span>
      </span>
    </div>
    <div
      class="form-group form-group_clear-gaps-bottom form-group_with-label item"
    >
      <span class="title">Price</span>
      <span
        class="value"
        :class="{ editMode: isEdit, mobile: $mq === 'mobile' }"
      >
        <span v-if="isEdit" class="field-symbol-currency">
          <span class="form-field">
            <input
              type="number"
              v-model="info.price"
              class="field-gap_currency"
              min="0"
              :step="0.01"
            />
          </span>
        </span>
        <span v-else class="value__text"> $ {{ info.price || "0" }} </span>
      </span>
    </div>
    <div
      class="form-group form-group_clear-gaps-bottom form-group_with-label item"
    >
      <span class="title">Delay</span>
      <span
        class="value"
        :class="{ editMode: isEdit, mobile: $mq === 'mobile' }"
      >
        <span v-if="isEdit" class="delay-input">
          <input
            type="number"
            v-model="info.delay"
            class="field-gap_currency"
            min="0"
            :step="1"
          />
          <span class="icn icn-item icn-clock" />
        </span>
        <span v-else class="value__text">
          {{ info.delay || "0" }} minutes
        </span>
      </span>
    </div>
    <div
      class="form-group form-group_clear-gaps-bottom form-group_with-label item"
    >
      <span class="title title-top">Image</span>
      <span
        v-if="info.image"
        class="image-container"
        :class="{ mobile: $mq === 'mobile' }"
      >
        <img :src="info.image" alt="welcome message image" />
        <span
          v-if="isEdit"
          @click="$emit('deleteImage')"
          class="icn-item btn-reset"
        />
      </span>
      <span
        v-if="imagePreview"
        class="image-container"
        :class="{ mobile: $mq === 'mobile' }"
      >
        <img :src="imagePreview" alt="welcome message image" />
        <span
          v-if="isEdit"
          @click="$emit('setImagePreview', '')"
          class="icn-item btn-reset"
        />
      </span>
      <span v-if="!info.image && !isEdit" class="value">
        <span class="value__text">Without image</span>
      </span>
      <span v-else-if="!info.image && !imagePreview && isEdit" class="value">
        <div class="photo-label-wrapper">
          <label
            :for="`image-${type}`"
            class="btn btn_fix-width btn_block border photo-btn"
            >{{ uploading ? "Uploading" : "Upload" }}</label
          >
        </div>

        <input
          type="file"
          :id="`image-${type}`"
          accept=".jpg,.jpeg,.png"
          :ref="`image-${type}`"
          :name="`image-${type}`"
          :disabled="uploading"
          @change="upload"
        />
      </span>
    </div>
    <div
      v-if="isEdit"
      class="form-group form-group_clear-gaps-bottom form-group_with-label item"
    >
      <span class="title"></span>
      <span class="value save-button-container">
        <button
          :disabled="!dataChanged || uploading"
          type="button"
          class="btn btn_fix-width"
          @click="$emit('save')"
        >
          Save
        </button>
      </span>
    </div>
  </div>
</template>

<script>
import FileUpload from "@/mixins/fileUpload";

export default {
  name: "MessageInfo",
  mixins: [FileUpload],
  data() {
    return {
      file: null,
      uploading: false
    };
  },
  props: {
    type: String,
    info: Object,
    settings: Object,
    dataChanged: Boolean
  },
  computed: {
    refName() {
      return `image-${this.type}`;
    },
    isEdit() {
      return this.settings.isEditMode;
    },
    imagePreview() {
      return this.settings.imagePreview;
    },
    allMediaTypes() {
      const { photo } = this.inputAcceptTypes;
      return [...photo];
    }
  },
  watch: {
    preloadedMedias(value) {
      if (value && value[0] && value[0].processId) {
        this.uploading = false;
        const filePath = value[0].processId;
        this.getImagePreview();
        this.$emit("setImagePath", filePath);
        this.preloadedMedias = [];
      }
    }
  },
  methods: {
    async upload() {
      try {
        const file = this.$refs[this.refName].files[0];
        this.uploading = true;
        this.addMediaFiles({ target: { files: [file] } });
      } catch (err) {
        console.log(err);
      }
    },
    getImagePreview() {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.$emit("setImagePreview", fileReader.result);
        this.$emit("deleteImage");
      };
      fileReader.readAsDataURL(this.$refs[this.refName].files[0]);
    }
  }
};
</script>

<style lang="scss" scoped>
.image-container {
  flex-grow: 2;
  margin-left: 2.5%;
  padding: 9px 0 0 5px;
  &.mobile {
    flex-basis: 300px;
    flex-grow: 0;
  }
  img {
    width: 200px;
    height: auto;
    position: relative;
  }
  .btn-reset {
    transform: translateX(-18px);
  }
}
.title {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  &.title-top {
    align-items: start;
  }
}
.delay-input {
  position: relative;
  .icn-clock {
    position: absolute;
    top: 7px;
    left: 6px;
    opacity: 0.3;
  }
}
.value.editMode.mobile {
  flex-basis: 300px;
}
</style>
