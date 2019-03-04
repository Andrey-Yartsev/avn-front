<template>
  <div class="addChatMessage" :class="{ disabled: isMuted }">
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
        :class="{ disabled: showTip || showPaid }"
        :disabled="disable"
        v-if="!preloadedMedias.length"
      >
        <input
          @change="addMediaFiles"
          type="file"
          accept=".jpg,.jpeg,.gif,.png,.mp4,.mov,.moov,.m4v,.mpg,.mpeg,.wmv,.avi"
        />
      </label>

      <button
        v-if="withUser && !withUser.canEarn && $root.showTips"
        class="tips btn-el"
        @click.prevent="showTip = !showTip"
        :class="{ active: showTip }"
      ></button>

      <div
        class="field-text-message"
        :class="{ disabled: showTip || showPaid }"
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
          :disabled="disable"
        ></TextareaAutosize>

        <div class="price-message-wrapper">
          <span class="price-message"></span>
          <button type="submit" class="btn-clear-price"></button>
        </div>

        <div class="price-message-wrapper" v-if="priceIsSet">
          <span class="price-message">${{ price }}</span>
          <button
            type="button"
            class="btn-clear-price"
            @click="resetPrice"
          ></button>
        </div>
      </div>

      <Tip
        v-if="withUser && !withUser.canEarn && $root.showTips"
        :user="withUser"
        ref="tip"
        @cancel="closeTip"
        :class="{ chatTip: true, hidden: !showTip }"
      />

      <div class="getPaidForm" v-if="showPaid">
        <button class="cancelPaid btn btn-cancel" @click="showPaid = false">Cancel</button>
        <input type="hidden" name="priceAmount" class="getPaidAmount" />
        <div class="price-amount-field getPaidForm__field">
          <input
            type="text"
            pattern="\d{1,3}(?:\.\d{0,2})?"
            maxlength="6"
            class="getPaidAmountPlaceholder"
            placeholder="Enter price"
            v-model="price"
          />
        </div>
        <button class="setPrice btn" @click="setPrice" :disabled="!price">
          Set Price
        </button>
      </div>

      <button
        class="getPaid btn-el"
        :class="{ active: showPaid }"
        v-if="user.canEarn"
        @click="showPaid = !showPaid"
      ></button>

      <button
        @click="sendMessage"
        class="submit btn-el"
        :disabled="!canSend || disable"
      ></button>
    </div>
  </div>
</template>

<script>
import MediaPreview from "@/components/common/MediaPreview";
import FileUpload from "@/mixins/fileUpload";
import Tip from "@/components/common/tip/User";
import TextareaAutosize from "@/components/common/TextareaAutosize";
import User from "@/mixins/user";

export default {
  name: "ChatAddMesssageBox",

  mixins: [FileUpload, User],

  components: {
    MediaPreview,
    Tip,
    TextareaAutosize
  },

  props: {
    withUser: {
      type: Object
    },
    disable: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      message: "",
      isSaving: false,
      showTip: false,
      showPaid: false,
      price: "",
      priceIsSet: false
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
    },
    allMediaTypes() {
      return this.inputAcceptTypes.photo;
    },
    isMuted() {
      if (!this.withUser) {
        return false;
      }
      return this.withUser.isMuted;
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
        price: this.price ? this.price : 0,
        text: message
      };
      if (mediaFiles.length) {
        opt.mediaFile = mediaFiles[0];
      }
      this.price = "";
      this.priceIsSet = false;
      this.$emit("send", opt);
    },
    closeTip() {
      this.showTip = false;
      this.$refs.tip.reset();
    },
    setPrice() {
      const p = parseFloat(this.price);
      if (!p) {
        alert("Use correct number");
        return;
      }
      if (p < 2) {
        alert("Minimum price is 2$");
        return;
      }
      this.price = p;
      this.priceIsSet = true;
      this.showPaid = false;
    },
    resetPrice() {
      this.priceIsSet = false;
      this.price = "";
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
