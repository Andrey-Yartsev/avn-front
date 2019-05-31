<template>
  <div class="chat-section">
    <Loader
      v-if="loading"
      :fullscreen="false"
      text=""
      class="transparent small"
    />
    <component
      :is="scrollableComponent"
      v-else
      class="chat-wrapper"
      ref="messagesContainer"
    >
      <div class="chat-scrollbar" ref="messagesMobileContainer">
        <div
          v-for="v in messages"
          v-bind:key="v.id"
          class="chatMessage"
          :class="{
            authorMessage: isAuthor(v),
            notAuthorMessage: !isAuthor(v),
            firstMessageInGroup: v.firstMessageInGroup,
            withTime: v.lastMessageInGroup
          }"
        >
          <div class="chatMessageWrapper">
            <div
              class="avatar avatar_gap-r-md avatar_sm"
              v-if="v.lastMessageInGroup && !isAuthor(v)"
            >
              <span class="avatar__img">
                <img :src="v.fromUser.avatar" v-if="v.fromUser.avatar" />
              </span>
            </div>
            <div class="messageContent">
              <div
                class="messageWrapper"
                :class="{
                  tipsMessage: v.isTips,
                  lockedMessage: isLocked(v),
                  unlockedMessage: isUnlocked(v),
                  'message-icon': isLocked(v) || v.isTips || !isLocked(v),
                  mine: isMyMessage(v)
                }"
                @click="messageClick(v)"
              >
                <span
                  class="message"
                  :class="{ 'message-locked': v.textLength && isLocked(v) }"
                  v-if="v.textLength"
                >
                  <span class="message__text" v-html="text(v)"></span>
                  <span
                    class="message-locked__text"
                    v-if="v.textLength && isLocked(v) && !isMyMessage(v)"
                    >{{ lockedText(v) }}</span
                  >
                </span>
                <div class="media media-item" v-if="v.media.length">
                  <MediaVideo
                    v-if="v.media.length && v.media[0].type === 'video'"
                    :message="v"
                    :ref="'video' + v.id"
                    @play="stopOtherVideo(v.id)"
                  />
                  <MediaImage
                    v-else-if="v.media.length && v.media[0].type === 'photo'"
                    :message="v"
                    ref="img"
                  />
                </div>
              </div>
              <div
                class="timestamp timestamp_sm-size message-time"
                v-if="v.lastMessageInGroup"
              >
                <span class="status">{{ v.isNew ? "Sent" : "Seen" }} </span>
                <span class="timeValue">{{ time(v.changedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="chatMessageSending semi-transparent" v-if="sending">
          Sending...
        </div>
      </div>
    </component>
  </div>
</template>

<script>
import userMixin from "@/mixins/user";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Loader from "@/components/common/Loader";
import { fromNow } from "@/helpers/datetime";
import MediaImage from "./media/Image";
import MediaVideo from "./media/Video";

export default {
  name: "ChatMessages",

  components: {
    VuePerfectScrollbar,
    Loader,
    MediaImage,
    MediaVideo
  },

  mixins: [userMixin],

  props: {
    _messages: {
      type: Array,
      required: true
    },
    withUser: {
      type: Object,
      required: true
    }
  },

  computed: {
    scrollableComponent() {
      return this.$mq === "mobile" ? "div" : VuePerfectScrollbar;
    },
    messages() {
      if (!this._messages.length) {
        return [];
      }
      const messages = JSON.parse(JSON.stringify(this._messages));
      return this.addGrouping(messages);
    },
    sending() {
      return this.$store.state.chat._sendMessageLoading;
    },
    loading() {
      return this.$store.state.chat._fetchMessagesLoading;
    }
  },

  watch: {
    messages() {
      setTimeout(() => {
        this.scrollToLast();
        if (this.$refs.img) {
          this.$refs.img.forEach(img => {
            img.$el.getElementsByTagName("img")[0].onload = () => {
              this.scrollToLast();
            };
          });
        }
      }, 100);
    }
  },

  methods: {
    isAuthor(message) {
      return message.fromUser.id === this.user.id;
    },

    text(message) {
      if (!message.isTips) {
        return message.text;
      } else {
        if (this.isAuthor(message)) {
          return (
            "You have funded " + this.withUser.name + " for " + message.text
          );
        } else {
          return "You have been funded for " + message.text;
        }
      }
    },

    lockedText(message) {
      let s = "";
      for (let i = 0; i < Math.round(message.textLength / 2); i++) {
        s += "x ";
      }
      return s;
    },

    addGrouping(messages) {
      return this.setFirstInGroup(this.setLastInGroup(messages));
    },

    setFirstInGroup(messages) {
      // if only one message
      if (messages.length === 1) {
        messages[messages.length - 1].firstMessageInGroup = true;
      } else {
        for (let i = 0; i < messages.length; i++) {
          let currentModel = messages[i];
          // if very first message
          if (i === 0) {
            currentModel.firstMessageInGroup = true;
            continue;
          }

          let currentMine = this.checkAuthor(currentModel.fromUser);
          let isPrevNotMine = !this.checkAuthor(messages[i - 1].fromUser);
          //If current message is mine but not previous message set firstMessageInGroup flag
          if (
            (currentMine && isPrevNotMine) ||
            (!currentMine && !isPrevNotMine)
          ) {
            messages[i].firstMessageInGroup = true;
          }
        }
      }
      return messages;
    },

    setLastInGroup(messages) {
      // if only one message
      if (messages.length === 1) {
        messages[messages.length - 1].lastMessageInGroup = true;
      } else {
        for (let i = 0; i < messages.length; i++) {
          // if very last message
          if (i === messages.length - 1) {
            messages[i].lastMessageInGroup = true;
            return messages;
          }

          let currentMine = this.checkAuthor(messages[i].fromUser);
          let isNextNotMine = !this.checkAuthor(messages[i + 1].fromUser);
          // If current message is mine but not next message OR current message is not mine but next one is mine - set lastMessageInGroup flag
          if (
            (currentMine && isNextNotMine) ||
            (!currentMine && !isNextNotMine)
          ) {
            messages[i].lastMessageInGroup = true;
          }
        }
      }
      return messages;
    },

    checkAuthor(user) {
      return user.id === this.user.id;
    },

    scrollToLast() {
      if (this.$mq === "mobile") {
        if (this.$refs.messagesMobileContainer) {
          this.$refs.messagesMobileContainer.scrollTop = this.$refs.messagesMobileContainer.scrollHeight;
        }
      } else {
        if (this.$refs.messagesContainer && this.$refs.messagesContainer.$el) {
          this.$refs.messagesContainer.$el.scrollTop = this.$refs.messagesContainer.$el.scrollHeight;
        }
      }
    },

    time(date) {
      return fromNow(date);
    },

    isMyMessage(message) {
      return message.fromUser.id === this.user.id;
    },

    messageClick(message) {
      if (this.isMyMessage(message)) {
        return;
      }
      if (message.isFree || message.isOpened) {
        return;
      }
      if (process.env.VUE_APP_NAME === "avn") {
        if (!this.user.isPaymentCardConnected) {
          this.$store.dispatch("global/flashToast", {
            text: "You should add card in payment settings",
            type: "warning"
          });
          this.$router.push("/settings/payments");
          return;
        }

        this.$store.dispatch("modal/show", {
          name: "chatMessagePayConfirm",
          data: {
            price: message.price,
            paymentType: "message",
            messageId: message.id
          }
        });
      }
    },

    isLocked(message) {
      return !message.isOpened && !message.isFree;
    },
    isUnlocked(message) {
      return message.isOpened && !message.isFree;
    },
    media(media) {
      if (media.type === "image") {
        return MediaImage;
      } else if (media.type === "video") {
        return MediaVideo;
      }
    },

    stopOtherVideo(currentPlayingId) {
      let videos = this._messages.filter(v => {
        const r = v.media && v.media.length && v.media[0].type === "video";
        if (!r) {
          return false;
        }
        return currentPlayingId !== v.id;
      });
      videos.forEach(v => {
        this.$refs["video" + v.id][0].cancelPlay();
      });
    }
  },

  mounted() {
    setTimeout(() => {
      this.scrollToLast();
    }, 100);
  }
};
</script>
