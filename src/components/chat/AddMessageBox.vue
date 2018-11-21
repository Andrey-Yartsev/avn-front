<template>
  <div class="addChatMessage">
    <div class="addFileCollectionView">
      <MediaPreview
        v-for="media in preloadedMedias"
        :media="media"
        :key="media.id"
        v-on:removePostMedia="removeMedia"
        :isSaving="isSaving"
      />
    </div>
    <div class="chatForm">
      <label
        class="add-media-input btn-el"
        :class="{disabled: showTip}"
        v-if="!preloadedMedias.length"
      >
        <input
          @change="addMediaFiles"
          type="file"
          accept=".jpg,.jpeg,.gif,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi">
      </label>

      <button
        v-if="user"
        class="tips btn-el"
        @click.prevent="showTip = !showTip"
        :class="{active: showTip}"
      ></button>

      <div
        class="field-text-message"
        :class="{disabled: showTip}"
      >
        <TextareaAutosize
          v-model="message"
          class="text-media-container"
          rows="1"
          cols="60"
          placeholder="Message"
          maxlength="500"
          :minHeight="30"
          :maxHeight="100"
          @enter="sendMessage"
        ></TextareaAutosize>
        <div class="price-message-wrapper"><span class="price-message"></span>
          <button type="submit" class="btn-clear-price"></button>
        </div>
      </div>

      <Tip
        v-if="user"
        :user="user"
        ref="tip"
        @cancel="closeTip"
        :class="{chatTip: true, hidden: !showTip}"
      />

      <div class="getPaidForm hidden">
        <button class="cancelPaid btn btn-cancel">Cancel</button>
        <input type="hidden" name="priceAmount" class="getPaidAmount">
        <div class="getPaidForm__field">
          <input
            type="text" pattern="\d{1,3}(?:\.\d{0,2})?" maxlength="6" class="getPaidAmountPlaceholder"
            placeholder="Enter price">
        </div>
        <button class="setPrice btn">Set Price</button>
      </div>
      <button class="getPaid btn-el hidden"></button>
      <button type="submit" class="submit btn-el" :disabled="!canSend"></button>
    </div>
  </div>
</template>

<script>
import MediaPreview from "@/components/common/MediaPreview";
import FileUpload from "@/mixins/fileUpload";
import Tip from "@/components/common/tip/User";
import TextareaAutosize from "@/components/common/TextareaAutosize";

export default {
  name: "ChatAddMesssageBox",

  mixins: [FileUpload],

  components: {
    MediaPreview,
    Tip,
    TextareaAutosize
  },

  props: {
    user: {
      type: Object
    }
  },

  data() {
    return {
      message: "",
      isSaving: false,
      showTip: false
    };
  },

  computed: {
    canSend() {
      if (this.showTip) {
        return false;
      }
      return this.message.trim() || this.preloadedMedias.length;
    },
    funded() {
      return this.$store.state.tip.funded;
    }
  },

  watch: {
    funded() {
      this.closeTip();
    }
  },

  methods: {
    async sendMessage(e) {
      e.preventDefault();
      if (e.ctrlKey || e.shiftKey) {
        this.message += "\n";
        return;
      }
      if (!this.canSend) {
        // console.log(this.message.trim());
        if (!this.message.trim()) {
          setTimeout(() => {
            this.message = "";
          }, 1);
        }
        return;
      }
      const message = this.message;
      this.message = "";
      this.isSaving = true;
      const mediaFiles = await this.getMediaFiles();
      this.preloadedMedias = [];
      const opt = {
        price: 0,
        text: message
      };
      if (mediaFiles.length) {
        opt.mediaFile = mediaFiles[0];
      }
      this.$emit("send", opt);
    },
    closeTip() {
      this.showTip = false;
      this.$refs.tip.reset();
    }
  }
};
</script>

<style scoped>
.text-media-container {
  overflow: hidden;
  overflow-wrap: break-word;
  min-height: 30px;
  border: 10px solid #f00;
}
</style>
