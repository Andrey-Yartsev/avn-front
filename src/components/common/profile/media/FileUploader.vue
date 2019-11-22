<template>
  <div class="example-full">
    <div
      v-if="$refs.upload && $refs.upload.dropActive"
      class="drop-area drop-area-active"
    >
      Drop files to upload
    </div>
    <div v-else class="drop-area">
      Drop files to upload
    </div>
    <div class="upload">
      <div class="table-responsive">
        <div class="table table-hover">
          <div class="table__header" v-if="files.length">
            <div class="row">
              <div class="col col-1">#</div>
              <div class="col col-2">Thumb</div>
              <div class="col col-4">Name</div>
              <div class="col col-1">Size</div>
              <div class="col col-2"></div>
            </div>
          </div>
          <div class="table__body">
            <div class="row" v-for="(file, index) in files" :key="file.id">
              <div class="col col-1">{{ index + 1 }}</div>
              <div class="col col-2">
                <div
                  class="addFileCollectionView mediaPreview"
                  v-if="preloadedMedias.length"
                >
                  <MediaPreview
                    :media="preloadedMedias[index]"
                    :isSaving="false"
                    @removeMedia="removeMedia"
                    :deleteButton="false"
                  />
                </div>
              </div>
              <div class="col col-4">
                {{ file.name }}
              </div>
              <div class="col col-1">{{ file.size | formatSize }}</div>
              <div class="col col-2">
                <button
                  :disabled="disableButtons"
                  class="btn btn-secondary btn-sm dropdown-toggle"
                  type="button"
                  @click.prevent="
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
          :extensions="extensions"
          :accept="accept"
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
        <div class="btn-group">
          <button
            :disabled="disableButtons"
            type="button"
            class="btn btn-success"
          >
            <label :for="name">Add files</label>
          </button>
          <button
            :disabled="disableButtons"
            class="btn btn-success"
            href="#"
            @click="onAddFolader"
          >
            Add folder
          </button>
          <button
            :disabled="disableButtons"
            type="button"
            class="btn btn-success start-upload"
            @click.prevent="sendHandler"
          >
            Start Upload
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import FileUpload from "vue-upload-component";
import FileUploadMixin from "@/mixins/fileUpload";
import MediaPreview from "@/components/common/MediaPreview";

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
    MediaPreview
  },
  mixins: [FileUploadMixin],
  props: {
    defaultLimits: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      files: [],
      accept:
        "image/png,image/gif,image/jpeg,image/webp,video/avi,video/mp4,video/mov,video/moov,video/m4v,video/mpg,video/mpeg,video/wmv",
      extensions: "jpg,jpeg,png,mp4,mov,moov,m4v,mpg,mpeg,wmv,avi,gif",
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
      disableButtons: false
    };
  },
  watch: {
    "addData.show"(show) {
      if (show) {
        this.addData.name = "";
        this.addData.type = "";
        this.addData.content = "";
      }
    }
  },
  computed: {
    allMediaTypes() {
      const { photo, video } = this.inputAcceptTypes;
      return [...photo, ...video];
    }
  },
  methods: {
    removeFileHandler(file, media) {
      console.log(media.id);
      this.$refs.upload.remove(file);
      this.removeMedia(media.id);
    },
    inputFile(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!this.isFormatCorrect(newFile.name)) {
          return prevent();
        }
        this.addMediaFiles({ target: { files: [newFile.file] } });
      }
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile && !this.isFormatCorrect(newFile.name)) {
        return prevent();
      }
    },
    onAddFolader() {
      let input = this.$refs.upload.$el.querySelector("input");
      input.directory = true;
      input.webkitdirectory = true;
      this.directory = true;
      input.onclick = null;
      input.click();
      input.onclick = () => {
        this.directory = false;
        input.directory = false;
        input.webkitdirectory = false;
      };
    },
    sendHandler() {
      const mediaFiles = this.preloadedMedias;
      const data = {};
      if (mediaFiles.length) {
        data.mediaFile = mediaFiles.map(item => ({ id: item.processId }));
      }
      console.log(data);
      this.disableButtons = true;
      setTimeout(() => {
        this.preloadedMedias = [];
        this.$refs.upload.clear();
        this.disableButtons = false;
      }, 1000);
      // this.$store.dispatch("profile/media/addMedia", data, { root: true });
    },
    isFormatCorrect(fileName) {
      if (
        /\.(jpeg|jpe|jpg|gif|png|webp|mp4|mpeg|mpg|wmv|avi)$/i.test(fileName)
      ) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
.drop-area {
  font-size: 16px;
  border: 1px solid #8080805c;
  border-radius: 5px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  &-active {
    background-color: #8080805c;
  }
  h3 {
    margin: 0;
  }
}
.upload {
  .table {
    margin: 0;
    width: 100%;
    &__header,
    &__body,
    &__footer {
      .row {
        .col {
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          &-1 {
            width: 10%;
          }
          &-2 {
            width: 20%;
          }
          &-3 {
            width: 30%;
          }
          &-4 {
            width: 40%;
          }
        }
      }
    }
  }
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
  .start-upload {
    margin-left: auto;
  }
}
.mediaPreview {
  & > div {
    margin-right: 0;
  }
}
</style>
