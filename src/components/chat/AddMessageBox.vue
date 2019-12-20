<template>
  <div class="addChatMessage" :class="{ disabled: isMuted }">
    <template v-if="withFontSizeController">
      <FontSizeControls />
    </template>
    <div class="addChatMessage__inside-section">
      <div class="addFileCollectionView" v-if="preloadedMedias.length">
        <MediaPreview
          v-for="media in preloadedMedias"
          :media="media"
          :key="media.id"
          :isSaving="isSaving"
          @removeMedia="removeMedia"
        />
      </div>
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
            @change="addMediaFiles"
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
            maxlength="500"
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
          v-tooltip="'Send'"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
import MediaPreview from "@/components/common/MediaPreview";
import FileUpload from "@/mixins/fileUpload";
import Tip from "@/components/common/tip/User";
import TextareaAutosize from "@/components/common/TextareaAutosize";
import User from "@/mixins/user";
import Form from "@/mixins/form";
import FontSizeControls from "./FontSizeControls";

export default {
  name: "ChatAddMesssageBox",

  mixins: [FileUpload, User, Form],

  components: {
    MediaPreview,
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
    allUsersCount: {
      type: Number,
      default: 0
    },
    confirmation: {
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
    canAddMedia() {
      return this.$props.maxMediaLength &&
        this.preloadedMedias.length >= this.$props.maxMediaLength
        ? false
        : true;
    },
    canSend() {
      if (this.showTip) {
        return false;
      }
      if (this.uploadInProgress) {
        return false;
      }
      if (this.$props.multipleMedia) {
        return this.preloadedMedias.length;
      }
      return this.message.trim() || this.preloadedMedias.length;
    },
    funded() {
      return this.$store.state.tip.funded;
    },
    allMediaTypes() {
      const { photo, video } = this.inputAcceptTypes;
      return [...photo, ...video];
    },
    isMuted() {
      if (!this.withUser) {
        return false;
      }
      return this.withUser.isMuted;
    },
    activeUserId() {
      return this.$store.state.chat.activeUserId;
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
      const message = this.message;

      this.isSaving = true;
      const mediaFiles = this.preloadedMedias;
      const opt = {
        price: this.price ? this.price : 0,
        text: message
      };
      if (mediaFiles.length) {
        if (this.$props.multipleMedia) {
          opt.mediaFile = mediaFiles.map(item => ({ id: item.processId }));
        } else {
          opt.mediaFile = [{ id: mediaFiles[0].processId }];
        }
      }

      if (this.confirmation && this.allUsersCount) {
        this.$store.dispatch("modal/show", {
          name: "confirm",
          data: {
            title:
              "You are going to send message to " +
              this.allUsersCount +
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
      this.showPaid = false;
      this.closeTip();
      this.resetPrice();
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
    }
  }
};
</script>
