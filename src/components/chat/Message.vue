<template>
  <div
    class="chatMessage"
    :class="{
      authorMessage: isAuthor,
      notAuthorMessage: !isAuthor,
      firstMessageInGroup: message.firstMessageInGroup,
      withTime: message.lastMessageInGroup
    }"
  >
    <div v-if="isAuthor" class="chatMessageControlsWrapper">
      <div class="messageControlsContainer" v-if="$mq === 'desktop'">
        <!-- <button class="btn-el" @click.prevent="editMessage" v-tooltip="'Edit'">
          <span class="icn-pencil icn-item icn-size_lg"></span>
        </button> -->
        <button
          class="btn-el"
          @click.prevent="deleteMessage()"
          v-tooltip="'Delete'"
        >
          <span class="icn-remove icn-item icn-size_lg"></span>
        </button>
      </div>
      <div v-else class="messageControlsContainer">
        <div class="more-functions__btn" @click="messageOptionMobileSwitch" />
        <div
          class="mobileControls"
          :class="{ opened: messageOptionMobileOpened }"
        >
          <!-- <button class="btn-el edit" @click.prevent="editMessage">
            <span class="icn-pencil icn-item icn-size_lg"></span>
          </button> -->
          <button class="btn-el delete" @click.prevent="deleteMessage">
            <span class="icn-remove icn-item icn-size_lg"></span>
          </button>
        </div>
      </div>
    </div>
    <div class="chatMessageWrapper">
      <div
        class="avatar avatar_gap-r-md avatar_sm"
        v-if="message.lastMessageInGroup && !isAuthor"
      >
        <span class="avatar__img">
          <img :src="message.fromUser.avatar" v-if="message.fromUser.avatar" />
        </span>
      </div>
      <div class="messageContent" :style="{ fontSize: chatFontSize }">
        <div
          class="messageWrapper"
          :class="{
            tipsMessage: message.paymentType,
            lockedMessage: isLocked,
            unlockedMessage: isUnlocked,
            'message-icon': isLocked || message.paymentType || !isLocked,
            mine: isMyMessage,
            snapchatMessage: message.isSnapchat
          }"
          @click="messageClick"
        >
          <span
            class="message rounded-corners"
            :class="{
              'message-locked':
                message.textLength && isLocked && !message.showPaidMessageText,
              'message-deleted': isMyMessage && message.isDeleted
            }"
            :style="{
              display: hasReplyMediaContent ? 'block' : 'inline-block'
            }"
            v-if="message.textLength"
          >
            <div v-if="message.reply" class="message__reply">
              <div class="message__reply-header">Replying to You</div>
              <div v-if="message.reply.media" class="message__reply-media">
                <div class="media-chat" v-if="message.reply.media.length">
                  <MediaAudio
                    v-if="message.reply.media[0].type === 'audio'"
                    :message="{
                      ...message.reply,
                      isOpened: true,
                      isFree: false,
                      isMediaReady: true
                    }"
                  />
                  <MediaVideosList
                    v-else-if="message.reply.media[0].type === 'video'"
                    :message="{
                      ...message.reply,
                      isOpened: true,
                      isFree: false,
                      isMediaReady: true
                    }"
                    :videos="message.reply.media"
                  />
                  <MediaImagesList
                    v-else-if="message.reply.media[0].type === 'photo'"
                    :message="{
                      ...message.reply,
                      isOpened: true,
                      isFree: false,
                      isMediaReady: true
                    }"
                    :images="message.reply.media"
                  />
                </div>
              </div>
              <div
                v-if="message.reply.docFiles && message.reply.docFiles.length"
                class="message__reply-media"
              >
                <div class="media-chat">
                  <a
                    :href="file.source"
                    class="icn-file-pdf icn-item"
                    v-for="file in message.reply.docFiles"
                    :key="file.id"
                    target="_blank"
                  ></a>
                </div>
              </div>
              <span
                v-if="message.reply.text"
                class="message__reply-text"
                v-html="message.reply.text"
              ></span>
            </div>
            <span class="message__text" v-html="text" />
            <span
              class="message-locked__text"
              v-if="message.textLength && isLocked && !isMyMessage"
              >{{ lockedText }}</span
            >
            <SubscribeButton
              v-if="message.registerLink"
              :profile="message.fromUser"
            />
          </span>
          <span
            v-if="
              message.textLength &&
                message.price &&
                !message.showPaidMessageText &&
                isLocked &&
                !isMyMessage
            "
            class="message-locked__price"
          >
            {{ message.price }}
          </span>

          <div
            class="media-chat"
            v-if="message.docFiles && message.docFiles.length"
          >
            <a
              :href="file.source"
              class="icn-file-pdf icn-item"
              v-for="file in message.docFiles"
              :key="file.id"
              target="_blank"
            ></a>
          </div>

          <div class="media-chat" v-if="message.media.length">
            <span
              v-if="message.price && isLocked && !isMyMessage"
              class="media-chat__price"
              >Price: {{ message.price }}</span
            >
            <MediaAudio
              v-if="message.media[0].type === 'audio'"
              :message="message"
            />
            <MediaVideosList
              v-else-if="message.media[0].type === 'video'"
              :message="message"
              :videos="message.media"
              @clickPassed="messageClick"
            />
            <MediaImagesList
              v-else-if="message.media[0].type === 'photo'"
              :message="message"
              :images="message.media"
              @clickPassed="messageClick"
            />
          </div>
          <template v-if="message.story">
            <div class="media-chat">
              <div class="media media-item">
                <figure
                  class="media-item active media-item_photo"
                  data-index="0"
                >
                  <span class="postLink">
                    <img
                      :src="message.story.preview"
                      class="media-content m-cover-size"
                    />
                  </span>
                </figure>
              </div>
            </div>
          </template>
          <template v-if="message.messageAttachment">
            <a
              v-for="(v, k) in message.messageAttachment"
              :href="v.url"
              target="_blank"
              class="userView userView_card rounded-corners nolink"
              :key="k"
            >
              <div class="bg bg-color bg-gradient_light">
                <img v-if="v.image" :src="v.image" />
              </div>
              <div class="user-container">
                <div class="names-actions-wrapper">
                  <div class="user-names">
                    <div class="wrap-name" v-html="v.title"></div>
                  </div>
                </div>
                <p
                  class="profile-text"
                  v-if="v.description"
                  v-html="v.description"
                ></p>
                <div class="link-render">
                  <a>{{ v.url }}</a>
                </div>
              </div>
            </a>
          </template>
        </div>
        <div
          v-if="
            isMyMessage &&
              !message.isFree &&
              message.isOpened &&
              message.payedAt
          "
          class="timestamp timestamp_sm-size message-time test"
        >
          <div class="message-time__written">
            <span class="timeValue"
              >Paid {{ message.price }} {{ time(message.payedAt) }}</span
            >
          </div>
        </div>
        <div class="timestamp timestamp_sm-size message-time">
          <div
            class="message-time__read"
            v-if="
              withUser.canWrite &&
                isMyMessage &&
                message.readDate &&
                message.lastMessageInGroup
            "
          >
            <span class="timeValue">Read {{ time(message.readDate) }}</span>
            <span class="icn-read icn-item" />
          </div>
          <div class="message-time__written" v-if="message.lastMessageInGroup">
            <span class="timeValue">Sent {{ time(message.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userMixin from "@/mixins/user";
import { fromNow } from "@/helpers/datetime";
import MediaAudio from "./media/Audio";
import MediaImagesList from "./media/ImagesList";
import MediaVideosList from "./media/VideosList";
import SubscribeButton from "@/components/subscription/Button";

export default {
  name: "ChatMessage",
  components: {
    SubscribeButton,
    MediaImagesList,
    MediaVideosList,
    MediaAudio
  },
  mixins: [userMixin],
  props: {
    message: {
      type: Object,
      required: true
    },
    withUser: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      messageOptionMobileOpened: false
    };
  },
  computed: {
    isAuthor() {
      return this.message.fromUser.id === this.user.id;
    },
    isLocked() {
      return !this.message.isOpened && !this.message.isFree;
    },
    isUnlocked() {
      return this.message.isOpened && !this.message.isFree;
    },
    isMyMessage() {
      return this.message.fromUser.id === this.user.id;
    },
    hasReplyMediaContent() {
      return !!this.message.reply?.media?.length;
    },
    chatFontSize() {
      return this.$store.state.chat.fontSize + "px";
    },
    text() {
      if (this.message.idDeleted) {
        return "Message deleted";
      }
      if (this.message.reply) {
        const text = this.isAuthor
          ? `You have paid ${this.message.withUser.name} ${
              this.message.text
            } to view this message`
          : `User ${this.message.fromUser.name} has paid for ${
              this.message.text
            } to view this message`;
        return text;
      } else if (!this.message.paymentType) {
        return this.message.text;
      } else {
        let text = "";
        switch (this.message.paymentType) {
          case "tip":
            text = this.isAuthor
              ? `You have tipped ${this.withUser.name} for ${this.message.text}`
              : `You have been tipped ${this.message.text}`;
            break;
          case "paidUnblock":
            text = this.isAuthor
              ? `You have paid ${this.message.text} for ${
                  this.withUser.name
                } to unblock the account`
              : `${this.message.fromUser.name} paid ${
                  this.message.text
                } to unblock the account`;
            break;
          default:
            break;
        }
        return text;
      }
    },
    lockedText() {
      let s = "";
      for (let i = 0; i < Math.round(this.message.textLength / 2); i++) {
        s += "x ";
      }
      return s;
    }
  },
  methods: {
    messageClick() {
      if (this.isMyMessage) {
        return;
      }
      if (this.message.isFree || this.message.isOpened) {
        return;
      }
      if (process.env.VUE_APP_NAME === "avn") {
        this.$store.dispatch("modal/show", {
          name: "chatMessagePayConfirm",
          data: {
            price: this.message.price,
            paymentType: "message",
            messageId: this.message.id
          }
        });
      }
    },
    time(date) {
      return fromNow(date);
    },
    deleteMessage() {
      this.$store.dispatch("modal/show", {
        name: "confirm",
        data: {
          title: `Delete this message`,
          confirmButtonText: "Delete",
          success: () => {
            this._deleteMessage();
          }
        }
      });
    },
    _deleteMessage() {
      this.$store
        .dispatch("chat/deleteMessage", {
          chatId: this.withUser.id,
          messageId: this.message.id
        })
        .then(() => {
          this.$store.dispatch("global/flashToast", {
            text: "Message delted"
          });
        })
        .catch(error => {
          this.$store.dispatch("global/flashToast", {
            text: error.message,
            type: "error"
          });
        });
    },
    editMessage() {
      console.log("edit");
    },
    messageOptionMobileSwitch() {
      this.messageOptionMobileOpened = !this.messageOptionMobileOpened;
    }
  }
};
</script>
