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
    <form class="chatForm" v-on:submit.stop.prevent="sendMessage">
      <label class="add-media-input btn-el">
        <input
          @change="addMediaFiles"
          type="file"
          accept=".jpg,.jpeg,.gif,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi">
      </label>
      <button class="tips btn-el hidden"></button>
      <div class="field-text-message">
        <textarea
          v-model="message"
          class="text-media-container" rows="1" cols="60" placeholder="Message" maxlength="500"
          style="overflow: hidden; overflow-wrap: break-word; height: 30px;"></textarea>
        <div class="price-message-wrapper"><span class="price-message"></span>
          <button type="button" class="btn-clear-price"></button>
        </div>
      </div>
      <div class="chatTip hidden">
        <button class="cancel btn btn-cancel">Cancel</button>
        <div class="chatTip__field">
          <input
            type="text" pattern="\d{1,3}(?:\.\d{0,2})?" maxlength="6" name="tipAmount" class="tipAmount"
            placeholder="Enter tip amount">
        </div>
        <button class="sendTip btn">Send tip</button>
      </div>
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
    </form>
  </div>
</template>

<script>
import MediaPreview from "@/components/common/MediaPreview";
import FileUpload from "@/mixins/fileUpload";

export default {
  name: "ChatAddMesssageBox",

  mixins: [FileUpload],

  components: {
    MediaPreview
  },

  data() {
    return {
      message: "",
      isSaving: false
    };
  },

  methods: {
    canSend() {
      return this.message || this.preloadedMedias.length;
    },
    async sendMessage() {
      this.isSaving = true;
      const mediaFiles = await this.getMediaFiles();
      this.preloadedMedias = [];
      const opt = {
        price: 0,
        text: this.message
      };
      if (mediaFiles.length) {
        opt.mediaFile = mediaFiles[0];
      }
      this.$emit("send", opt);
      this.message = "";
    }
  }
};
</script>
