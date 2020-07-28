<template>
  <div
    class="fileUploader"
    @click="fileUploaderClickHandler"
    :class="{ withMargin: $mq === 'mobile', withHoverEffect: !files.length }"
  >
    <div
      class="loader-container loader-container_center clickPrevent"
      v-if="loading"
    >
      <Loader
        :fullscreen="false"
        :small="true"
        :semidark="true"
        class="text-light"
      />
    </div>
    <div
      class="dropArea"
      :class="{ dropAreaAtive: $refs.upload && $refs.upload.dropActive }"
    >
      <img src="/static/img/ic-drop-files.svg" alt="drop area folder" />
      Drop {{ type }} file(s) here
    </div>
    <div class="upload">
      <div class="table-responsive" v-if="files.length">
        <div class="table table-hover">
          <div class="table__body">
            <div
              class="row"
              style="position: relative"
              v-for="(file, index) in files"
              :key="file.id"
            >
              <div
                class="col col-item"
                :class="{ fullWidthCol: $mq === 'mobile' }"
              >
                <div
                  class="addFileCollectionView mediaPreview"
                  :class="{ mobileMediaPreview: $mq === 'mobile' }"
                  v-if="preloadedMedias.length == files.length"
                >
                  <MediaPreview
                    :media="preloadedMedias[index]"
                    :isSaving="false"
                    @removeMedia="removeMedia"
                    :deleteButton="false"
                  />
                </div>
              </div>
              <div class="col col-item fileInfo">
                <div class="fileInfo__name">
                  {{ $mq === "mobile" ? trimString(file.name, 20) : file.name }}
                </div>
                <div class="fileInfo__size">
                  {{ file.size | formatSize }}
                </div>
              </div>
              <div
                class="col col-item col-item-last"
                style="position: relative"
              >
                <template
                  v-if="
                    preloadedMedias.length == files.length &&
                      isFileInProgress(preloadedMedias[index].processId)
                  "
                >
                  <Loader
                    :fullscreen="false"
                    :small="true"
                    :inline="true"
                    class="text-light"
                  />
                  <div v-if="$mq === 'mobile'" style="margin: 10px" />
                  <button
                    v-else
                    class="btn btn-secondary btn-sm dropdown-toggle"
                    disabled
                    style="marginLeft: 10px"
                  >
                    Loading...
                  </button>
                </template>
                <button
                  :data-id="preloadedMedias[index].processId"
                  v-else-if="preloadedMedias.length == files.length"
                  :disabled="disableButtons"
                  class="btn btn-secondary btn-sm dropdown-toggle"
                  type="button"
                  @click.stop.prevent="
                    removeFileHandler(file, preloadedMedias[index])
                  "
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="table__footer">
        <file-upload
          :extensions="extensions[type]"
          :accept="accept[type]"
          :multiple="multiple"
          :directory="directory"
          :drop="drop"
          :drop-directory="dropDirectory"
          :add-index="addIndex"
          v-model="files"
          @input-file="inputFile"
          @input-filter="inputFilter"
          ref="upload"
        />
        <button
          v-if="type === 'photo' && this.files.length"
          class="btn btn-secondary btn-lg upload-button"
          @click.stop.prevent="uploadPhotoset"
        >
          Upload Photoset
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import FileUpload from "vue-upload-component";
import Loader from "@/components/common/Loader";
import FileUploadMixin from "@/mixins/fileUpload";
import MediaPreview from "@/components/common/MediaPreview";
import { logDebug } from "@/utils/logging";

Vue.filter("formatSize", function(size) {
  if (size > 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + " TB";
  } else if (size > 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + " GB";
  } else if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + " MB";
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + " KB";
  }
  return size.toString() + " B";
});

export default {
  components: {
    FileUpload,
    MediaPreview,
    Loader
  },
  mixins: [FileUploadMixin],
  props: {
    defaultLimits: {
      type: Object,
      default: null
    },
    disableWatermark: Boolean,
    type: {
      type: String,
      default: "video"
    }
  },
  data() {
    return {
      files: [],
      accept: {
        video:
          "video/avi,video/mp4,video/mov,video/moov,video/m4v,video/mpg,video/mpeg,video/wmv",
        audio: "audio/mp3,audio/ogg,audio/wav",
        photo: "photo/jpg,photo/jpeg,photo/png"
      },
      extensions: {
        video: "mp4,mov,moov,m4v,mpg,mpeg,wmv,avi",
        audio: "mp3,ogg,wav",
        photo: "jpg,jpeg,png"
      },
      multiple: true,
      directory: false,
      drop: true,
      dropDirectory: true,
      addIndex: false,
      name: "file",
      uploadAuto: false,
      addData: {
        show: false,
        name: "",
        type: "",
        content: ""
      },
      disableButtons: false,
      loading: false,
      fileBuffer: [],
      readyToUploadFile: null,
      filesInProgress: []
    };
  },
  watch: {
    "addData.show"(show) {
      if (show) {
        this.addData.name = "";
        this.addData.type = "";
        this.addData.content = "";
      }
    },
    "files.length"(value) {
      this.$emit("setFilesLength", value);
    },
    readyToUploadFile(newFile) {
      if (this.type === "photo") {
        return;
      }
      this.filesInProgress.push(newFile);
      this.$store
        .dispatch(
          "profile/media/addMedia",
          { mediaFiles: [{ id: newFile }], type: this.type },
          { root: true }
        )
        .then(() => {
          logDebug({
            logger: "ClipStore",
            message: "Create clip success",
            logData: {
              processId: newFile
            }
          });
          this.disableButtons = false;
          this.loading = false;
          this.filesInProgress = this.filesInProgress.filter(
            item => item !== newFile
          );
          this.$nextTick(() => {
            this.triggerClickEvent(newFile);
          });
        });
    }
  },
  computed: {
    allMediaTypes() {
      const { photo, video, audio } = this.inputAcceptTypes;
      return [...photo, ...video, ...audio];
    },
    canSend() {
      if (this.uploadInProgress || !this.files.length || this.disableButtons) {
        return false;
      }
      return true;
    },
    // eslint-disable-next-line no-unused-vars
    isFileInProgress(id) {
      return function(id) {
        return this.filesInProgress.includes(id);
      };
    },
    withoutWatermark() {
      return this.$props.disableWatermark;
    }
  },
  methods: {
    triggerClickEvent(newFile) {
      const button = document.querySelector(`[data-id="${newFile}"]`);
      button.click();
      this.preloadedMedias = this.preloadedMedias.filter(
        item => item.processId !== newFile
      );
    },
    removeFileHandler(file, media) {
      this.$refs.upload.remove(file);
      this.removeMedia(media.id);
    },
    inputFile(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!this.isFormatCorrect(newFile.name)) {
          return prevent();
        }
        if (!newFile.type) {
          this.setFileTypeManually(newFile.file);
        }
        logDebug({
          logger: "ClipStore",
          message: "Drop file",
          logData: {
            name: newFile.file.name,
            type: newFile.file.type,
            size: newFile.file.size
          }
        });
        if (!this.fileBuffer.length) {
          setTimeout(() => {
            this.sendFilesFromBuffer();
            this.fileBuffer = [];
          }, 300);
        }
        this.fileBuffer.push(newFile.file);
      }
    },
    sendFilesFromBuffer() {
      this.addMediaFiles({ target: { files: this.fileBuffer } });
    },
    setFileTypeManually(file) {
      Object.defineProperty(file, "type", {
        writable: true
      });
      const format = file.name.split(".").pop();
      file.type = `video/${format}`;
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile && this.loading) {
        prevent();
      }
      if (
        newFile &&
        !oldFile &&
        this.files.length >= this.defaultLimits[this.type]
      ) {
        this.$store.dispatch(
          "global/flashToast",
          {
            text: `Limit of ${this.defaultLimits[this.type]} files is reached`
          },
          { root: true }
        );
      }
      if (
        newFile &&
        !oldFile &&
        this.files.length &&
        this.files.find(
          item => item.name === newFile.name && item.size === newFile.size
        )
      ) {
        console.log("same file uploading already");
        this.$store.dispatch(
          "global/flashToast",
          { text: "The same file is already uploading", type: "warning" },
          { root: true }
        );
        return prevent();
      }
      if (newFile && !oldFile && !this.isFormatCorrect(newFile.name)) {
        console.log("wrong format");
        return prevent();
      }
      if (newFile && !oldFile && !this.isValidFileSize(newFile.size)) {
        return prevent();
      }
    },
    isFormatCorrect(fileName) {
      if (
        /\.(mp4|mpeg|mpg|m4v|wmv|avi|mov|moov|mp3|ogg|wav|jpg|jpeg|png)$/i.test(
          fileName
        )
      ) {
        return true;
      }
      return false;
    },
    trimString(str, maxLength) {
      const fileName = str.split("/").pop();
      if (fileName.length <= maxLength) return fileName;
      return fileName.slice(0, maxLength) + "...";
    },
    fileUploaderClickHandler() {
      const input = this.$refs.upload.$el.querySelector("input");
      if (input && !this.loading) {
        input.click();
      }
    },
    setMediaIsReady(processId) {
      this.readyToUploadFile = processId;
    },
    uploadPhotoset() {
      this.loading = true;
      this.$store
        .dispatch(
          "profile/media/addMedia",
          {
            mediaFiles: this.preloadedMedias.map(item => ({
              id: item.processId
            })),
            type: this.type
          },
          { root: true }
        )
        .then(() => {
          // logDebug({
          //   logger: "ClipStore",
          //   message: "Create photoset success",
          //   logData: {
          //     processId: res.productId
          //   }
          // });
          this.disableButtons = false;
          this.loading = false;
          this.filesInProgress = [];
          this.files = [];
          this.preloadedMedias = [];
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.fileUploader {
  position: relative;
  margin: 10px 0;
  border-radius: 5px;
  box-shadow: 0 1px 4px 2px #80808054;
  cursor: pointer;
  &.withHoverEffect {
    transition: box-shadow 0.3s ease;
    &:hover {
      box-shadow: 0 1px 2px 0px #80808054;
    }
  }
  &.withMargin {
    margin: 10px;
  }
}
.dropArea {
  padding-top: 30px;
  font-size: 16px;
  border-radius: 5px;
  min-height: 100px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  color: #909598;

  &Active {
    background-color: #8080805c;
  }
  h3 {
    margin: 0;
  }
}
.upload {
  padding: 10px 0;
  .table {
    margin: 0;
    width: 100%;
    > * {
      border-bottom: none;
    }
    &__header,
    &__body,
    &__footer {
      .row {
        width: 100%;
        margin: 0;
        border-bottom: 1px solid #80808038;
        padding: 10px 0;
        .col {
          text-align: center;
          display: flex;
          align-items: center;
          padding: 0 5px;
          &-item {
            &.fileInfo {
              flex-flow: column nowrap;
              justify-content: center;
              text-align: start;
              align-items: flex-start;
              .fileInfo__size {
                color: #808080a8;
              }
            }
            &-last {
              margin-left: auto;
            }
          }
        }
      }
    }
  }
}
.buttonWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.example-footer {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}
.btn-group {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
}
.mediaPreview {
  & > div {
    margin-right: 0;
    margin-bottom: 0;
  }
}
.mobileMediaPreview {
  margin: auto;
}
.btn-danger {
  background-color: #ff4081;
  padding: 0 40px;
  transition: all 0.3s ease;
  &:hover {
    background-color: rgb(192, 51, 98);
  }
}
.clickPrevent {
  pointer-events: none;
}
.spinner {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 200;
  background-color: rgba(128, 128, 128, 0.473);
}
.fullWidthCol {
  width: 100%;
}
.upload-button {
  margin: 0 auto 10px auto;
  display: block;
}
</style>
