<template>
  <div class="addChatMessage" :class="{ disabled: isMuted || isDeleted }">
    <template v-if="withFontSizeController">
      <FontSizeControls />
    </template>
    <div
      v-if="withUser && withUser.isSpamReported"
      class="info-message semi-transparent"
    >
      You are unable to send messages to this user
    </div>
    <div class="addChatMessage__inside-section">
      <div
        class="addFileCollectionView"
        v-if="preloadedMedias.length || preloadedPdfFiles.length"
      >
        <MediaPreview
          v-for="media in preloadedMedias"
          :media="media"
          :key="media.id"
          :isSaving="isSaving"
          @removeMedia="removeMedia"
        />
        <PdfPreview
          v-for="media in preloadedPdfFiles"
          :media="media"
          :key="media.id"
          :isSaving="isSaving"
          @removeMedia="removePdf"
        />
      </div>
      <span v-if="showFreeTextSwitcher" class="freeText-switcher">
        <span class="label">Unlock text</span>
        <label class="toggle-element">
          <input
            type="checkbox"
            name="isStreamsTweet"
            v-model="showPaidMessageText"
          />
          <span class="toggle-element_switcher" />
        </label>
      </span>
      <div class="chatForm">
        <label
          class="add-media-input"
          :class="{ disabled: showTip || showPaid }"
          :disabled="disable"
          v-if="
            multipleMedia ? canAddMedia : !preloadedMedias.length ? true : false
          "
          v-tooltip="'Media'"
        >
          <input
            @change="addChatMediaFiles"
            type="file"
            :multiple="multipleMedia"
            :accept="getAcceptedFormats"
          />
          <span class="icn-media icn-item icn-size_lg"></span>
        </label>

        <button
          v-if="withTips && withUser && withUser.canEarn && $root.showTips"
          class="tips btn-el"
          @click.prevent="showTip = !showTip"
          :class="{ active: showTip, disabled: showPaid }"
          v-tooltip="'Tip'"
        >
          <span class="icn-tips icn-item icn-size_lg"></span>
        </button>

        <div
          v-if="withInput"
          class="field-text-message"
          :class="{ disabled: showTip || showPaid, 'has-price': priceIsSet }"
        >
          <TextareaAutosize
            v-model="message"
            class="text-media-container rounded lg"
            rows="1"
            cols="60"
            :placeholder="textareaPlaceholder"
            maxlength="10000"
            :minHeight="30"
            :maxHeight="100"
            @enter="sendMessage"
            @keypress="keypress"
            :disabled="disable"
          ></TextareaAutosize>

          <div class="price-message-wrapper" v-if="priceIsSet">
            <span class="price-message">${{ price }}</span>
            <button
              type="button"
              class="btn-clear-price btn-reset btn-reset_fix-sizes btn-reset_ml icn-item icn-pos_center"
              @click="resetPrice"
            ></button>
          </div>
        </div>

        <Tip
          v-if="withUser && withUser.canEarn && $root.showTips"
          :user="withUser"
          ref="tip"
          @cancel="closeTip"
          :class="{ chatTip: true, hidden: !showTip }"
        />

        <div
          class="tip-form tip-form_post getPaidForm"
          v-if="showPaid"
          key="paidPrice"
        >
          <button class="cancelPaid btn btn-cancel" @click="cancelPriceHandler">
            Cancel
          </button>
          <input type="hidden" name="priceAmount" class="getPaidAmount" />
          <div class="price-amount-field getPaidForm__field enabled-tooltip">
            <input
              type="number"
              name="paidPrice"
              class="getPaidAmountPlaceholder"
              placeholder="Enter price"
              v-model="price"
              :class="{ error: fieldError('paidPrice') }"
              v-validate="'subscription-price'"
            />
            <div
              class="tooltip tooltip_error-field"
              x-placement="top"
              aria-hidden="true"
              v-if="fieldError('paidPrice')"
            >
              <div class="tooltip-arrow"></div>
              <div class="tooltip-inner">
                {{ fieldError("paidPrice") }}
              </div>
            </div>
          </div>
          <button
            class="setPrice btn"
            @click="setPrice"
            :disabled="!isFormValid || !price"
          >
            Set Price
          </button>
        </div>

        <button
          class="getPaid btn-el"
          :class="{ active: showPaid, disabled: showTip }"
          v-if="user.canEarn && withPrice"
          @click="showPaidForm"
          v-tooltip="'Price'"
        >
          <span class="icn-item icn-price icn-size_lg"></span>
        </button>

        <button
          @click="sendMessage"
          class="btn-send btn-send_default icn-item icn-size_lg"
          :disabled="!canSend"
          v-tooltip="sendButtonTooltip"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
import MediaPreview from "@/components/common/MediaPreview";
import PdfPreview from "@/components/common/PdfPreview";
import FileUpload from "@/mixins/fileUpload";
import Tip from "@/components/common/tip/User";
import TextareaAutosize from "@/components/common/TextareaAutosize";
import User from "@/mixins/user";
import Form from "@/mixins/form";
import FontSizeControls from "./FontSizeControls";
import PaidBlock from "@/mixins/paidBlock";
import { uniqId } from "@/utils/mediaFiles";
import upload from "@/utils/upload";

export default {
  name: "ChatAddMessageBox",

  mixins: [FileUpload, User, Form, PaidBlock],

  components: {
    MediaPreview,
    PdfPreview,
    Tip,
    TextareaAutosize,
    FontSizeControls
  },

  props: {
    withUser: {
      type: Object
    },
    disable: {
      type: Boolean,
      default: false
    },
    withFontSizeController: {
      type: Boolean,
      default: true
    },
    withTips: {
      type: Boolean,
      default: true
    },
    textareaPlaceholder: {
      type: String,
      default: "Message"
    },
    multipleMedia: {
      type: Boolean,
      default: false
    },
    withInput: {
      type: Boolean,
      default: true
    },
    withPrice: {
      type: Boolean,
      default: true
    },
    maxMediaLength: {
      type: Number,
      default: null
    },
    defaultLimits: {
      type: Object,
      default: null
    },
    videosOnly: {
      type: Boolean,
      default: false
    },
    recipientsCount: {
      type: Number,
      default: 0
    },
    confirmation: {
      type: Boolean,
      default: false
    },
    initData: {
      type: Object
    },
    sendButtonTooltip: {
      type: String,
      default: "Send"
    }
  },

  data() {
    return {
      message: "",
      isSaving: false,
      showTip: false,
      showPaid: false,
      price: "",
      priceIsSet: false,
      showPaidMessageText: false,
      limits: {
        video: 3,
        gif: 1,
        photo: 50,
        audio: 1
      },
      preloadedPdfFiles: []
    };
  },

  computed: {
    canAddMedia() {
      if (!this.preloadedMedias.length) {
        return true;
      }
      if (
        this.$props.maxMediaLength &&
        this.preloadedMedias.length >= this.$props.maxMediaLength
      ) {
        return false;
      }
      const loadedMediaType = this.preloadedMedias[0].mediaType;
      return this.preloadedMedias.length < this.limits[loadedMediaType];
    },
    canSend() {
      if (this.showTip) {
        return false;
      }
      if (this.uploadInProgress) {
        return false;
      }
      if (this.preloadedPdfFiles.length) {
        return true;
      }
      // if (this.$props.multipleMedia) {
      //   return this.preloadedMedias.length;
      // }
      return this.message.trim() || this.preloadedMedias.length;
    },
    funded() {
      return this.$store.state.tip.funded;
    },
    allMediaTypes() {
      const { video, audio } = this.inputAcceptTypes;
      return [...["jpg", "jpeg", "png", "pdf"], ...video, ...audio];
    },
    isMuted() {
      if (!this.withUser) {
        return false;
      }
      return this.withUser.isMuted;
    },
    isDeleted() {
      if (!this.withUser) {
        return false;
      }
      return !this.withUser.active;
    },
    activeUserId() {
      return this.$store.state.chat.activeUserId;
    },
    getAcceptedFormats() {
      if (!this.preloadedMedias.length) {
        return this.allMediaTypes.map(item => "." + item).join();
      }
      const loadedMediaType = this.preloadedMedias[0].mediaType;
      return (
        this.inputAcceptTypes[loadedMediaType].map(item => "." + item).join() +
        ",.pdf"
      );
    },
    showFreeTextSwitcher() {
      return (
        this.preloadedMedias.length &&
        this.message.trim().length &&
        this.priceIsSet
      );
    }
  },

  watch: {
    funded() {
      this.closeTip();
    },
    activeUserId() {
      this.reset();
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
      if (this.withUser && this.isPaidBlockedBy(this.withUser.id)) {
        this.openPaidUnblockModal({
          userId: this.withUser.id,
          username: this.withUser.username
        });
        return;
      }
      const message = this.message;

      this.isSaving = true;
      const mediaFiles = this.preloadedMedias;
      const opt = {
        price: this.price ? this.price : 0,
        text: message
      };
      if (this.showFreeTextSwitcher) {
        opt.showPaidMessageText = this.showPaidMessageText;
      }
      if (mediaFiles.length) {
        if (this.$props.multipleMedia) {
          opt.mediaFile = mediaFiles.map(item => ({ id: item.processId }));
        } else {
          opt.mediaFile = [{ id: mediaFiles[0].processId }];
        }
      }
      if (this.preloadedPdfFiles) {
        opt.docFile = this.preloadedPdfFiles;
      }

      if (this.confirmation && this.recipientsCount) {
        this.$store.dispatch("modal/show", {
          name: "confirm",
          data: {
            title:
              "You are going to send message to " +
              this.recipientsCount +
              " users",
            success: () => {
              this.$emit("send", opt);
              this.reset();
            }
          }
        });
      } else {
        this.$emit("send", opt);
        this.reset();
      }
    },
    closeTip() {
      if (!this.$refs.tip) {
        return;
      }
      this.showTip = false;
      this.$refs.tip.reset();
    },
    showPaidForm() {
      this.showPaid = !this.showPaid;
      this.$validator.resume();
    },
    setPrice() {
      this.$validator.pause();
      const p = parseFloat(this.price);
      if (!p) {
        this.$store.dispatch(
          "global/setError",
          { message: "Use correct number" },
          { root: true }
        );
        return;
      }
      if (p < 2) {
        this.$store.dispatch(
          "global/setError",
          { message: "Minimum price is $2" },
          { root: true }
        );
        return;
      }
      this.price = p;
      this.priceIsSet = true;
      this.showPaid = false;
    },
    resetPrice() {
      this.priceIsSet = false;
      this.price = "";
    },
    reset() {
      this.message = "";
      this.preloadedMedias = [];
      this.preloadedPdfFiles = [];
      this.showPaid = false;
      this.closeTip();
      this.resetPrice();
      this.showPaidMessageText = false;
    },
    keypress() {
      if (!this.withUser) {
        return;
      }
      this.$root.ws.send({
        act: "typing",
        typing_to: this.withUser.id,
        typing_from_name: this.user.name,
        typing_from_id: this.user.id
      });
    },
    cancelPriceHandler() {
      this.showPaid = false;
      this.$nextTick(() => {
        this.resetPrice();
      });
    },
    handleDroppedFiles(files) {
      files.forEach(file => {
        const fileType = file.type.split("/")[1];

        if (fileType === "pdf") {
          this.addPdfFile(file);
          return;
        }

        if (!this.preloadedMedias.length) {
          if (this.allMediaTypes.includes(fileType)) {
            this.addMediaFiles({ target: { files: [file] } });
          }
        } else {
          const acceptedTypes = this.getAcceptedFormats.split(",");
          if (acceptedTypes.includes(`.${fileType}`)) {
            this.addMediaFiles({ target: { files: [file] } });
          }
        }
      });
    },
    addChatMediaFiles(e) {
      const files = Array.from(e.target.files).map(v => v);
      const _files = [];

      files.forEach(file => {
        const fileType = file.type.split("/")[1];
        if (fileType === "pdf") {
          this.addPdfFile(file);
          return;
        }
        _files.push(file);
      });

      this._addMediaFiles(_files);
    },
    addPdfFile(file) {
      const id = uniqId() + (this.preloadedPdfFiles.length + 1);

      this.preloadedPdfFiles.push({
        file,
        mediaType: "pdf",
        userFileName: file.name,
        id,
        loaded: 0,
        size: file.name
      });

      upload(file, "doc", {
        onProgress: (loaded, total) => {
          const progress = Math.round((loaded / total) * 100);
          this.preloadedPdfFiles = this.preloadedPdfFiles.map(v => {
            return v.id === id ? { ...v, loaded: progress } : v;
          });
        }
      }).then(fileName => {
        this.preloadedPdfFiles = this.preloadedPdfFiles.map(v => {
          return v.id === id ? { ...v, fileName } : v;
        });
      });
    },
    removePdf(id) {
      this.preloadedPdfFiles = this.preloadedPdfFiles.filter(v => v.id !== id);
    },
    init() {
      this.message = this.initData.text || "";
      this.price =
        parseFloat(this.initData.price) > 0 ? this.initData.price : "";
      this.priceIsSet =
        !!this.initData.price && parseFloat(this.initData.price) > 0;
      this.showPaidMessageText = this.initData.showPaidMessageText || false;
      this.preloadedMedias = (this.initData.mediaFiles || []).map(media => ({
        alreadySaved: true,
        fileContent: media.thumb?.source,
        id: media.id,
        processId: media.id,
        mediaType: media.type,
        preview: media.thumb?.source
      }));
    }
  },
  mounted() {
    if (this.initData) {
      this.init();
    }
  }
};
</script>
