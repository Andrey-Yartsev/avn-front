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
        <table class="table table-hover">
          <thead v-if="files.length">
            <tr>
              <th>#</th>
              <th>Thumb</th>
              <th>Name</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, index) in files" :key="file.id">
              <td>{{ index + 1 }}</td>
              <td>
                <img
                  v-if="file.thumb"
                  :src="file.thumb"
                  width="60"
                  height="auto"
                />
                <span v-else>No Image</span>
              </td>
              <td>
                <div class="filename">
                  {{ file.name }}
                </div>
              </td>
              <td>{{ file.size | formatSize }}</td>
              <td>
                <div class="btn-group">
                  <button
                    class="btn btn-secondary btn-sm dropdown-toggle"
                    type="button"
                    @click.prevent="$refs.upload.remove(file)"
                  >
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="example-footer">
        <file-upload
          :extensions="extensions"
          :accept="accept"
          :multiple="multiple"
          :directory="directory"
          :size="size || 0"
          :data="data"
          :drop="drop"
          :drop-directory="dropDirectory"
          :add-index="addIndex"
          v-model="files"
          @input-file="inputFile"
          @input-filter="inputFilter"
          ref="upload"
        />
        <div class="btn-group">
          <label :for="name" type="button" class="btn btn-success"
            >Add files</label
          >
          <button class="btn btn-success" href="#" @click="onAddFolader">
            Add folder
          </button>
          <button
            type="button"
            class="btn btn-success start-upload"
            v-if="!$refs.upload || !$refs.upload.active"
            @click.prevent="$refs.upload.active = true"
          >
            Start Upload
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

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
</style>

<script>
import FileUpload from "vue-upload-component";
export default {
  components: {
    FileUpload
  },
  data() {
    return {
      files: [],
      accept:
        "image/png,image/gif,image/jpeg,image/webp,video/avi,video/mp4,video/mov,video/moov,video/m4v,video/mpg,video/mpeg,video/wmv",
      extensions: "jpg,jpeg,png,mp4,mov,moov,m4v,mpg,mpeg,wmv,avi",
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
      }
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
  methods: {
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        newFile.blob = "";
        let URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file);
        }
        // Thumbnails
        newFile.thumb = "";
        if (newFile.blob && newFile.type.substr(0, 6) === "image/") {
          newFile.thumb = newFile.blob;
        }
      }
    },
    // add, update, remove File Event
    inputFile(newFile, oldFile) {
      console.log("input event");
      console.log(newFile, oldFile);
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
    }
  }
};
</script>
