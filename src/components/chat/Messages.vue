<template>
  <div class="chat-section">
    <Loader
      v-if="loading"
      :fullscreen="false"
      text=""
      class="transparent small"
    />
    <VuePerfectScrollbar v-else class="chat-wrapper" ref="messagesContainer">
      <div class="chat-scrollbar">
        <div
          v-for="v in messages"
          v-bind:key="v.id"
          class="chatMessage notAuthorMessage"
          :class="{
            authorMessage: isAuthor(v),
            firstMessageInGroup: v.firstMessageInGroup,
            withTime: v.lastMessageInGroup
          }"
        >
          <div class="chatMessageWrapper">
            <div class="avatar avatar_gap-r-md avatar_sm">
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
                  mine: isMyMessage(v)
                }"
                @click="messageClick(v)"
              >
                <span class="message" v-html="text(v)"></span>
                <div class="media" v-if="v.media.length">
                  <template v-if="!v.media[0].locked">
                    <figure
                      class="media-item active media-item_photo"
                      data-index="0"
                    >
                      <a
                        class="postLink"
                        :href="v.media[0].src.source"
                        target="_blank"
                      >
                        <img
                          :src="v.media[0].src.source"
                          width="760"
                          height="428"
                        />
                      </a>
                    </figure>
                  </template>
                  <template>
                    <img :src="`data:image/jpeg;base64,${v.media[0].locked}`" />
                  </template>
                </div>
              </div>
              <div class="time" v-if="v.lastMessageInGroup">
                <span class="status">{{ v.isNew ? "Sent" : "Seen" }} </span>
                <span class="timeValue"> {{ time(v.changedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="chatMessageSending" v-if="sending">
          Sending...
        </div>
      </div>
    </VuePerfectScrollbar>
  </div>
</template>

<script>
import userMixin from "@/mixins/user";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Loader from "@/components/common/Loader";
import { fromNow } from "@/helpers/datetime";

export default {
  name: "ChatMessages",

  components: {
    VuePerfectScrollbar,
    Loader
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
    messages() {
      if (!this._messages.length) {
        return [];
      }
      const messages = JSON.parse(JSON.stringify(this._messages));
      return this.addGrouping(messages);
    },
    sending() {
      return this.$store.state.chat.sendMessageLoading;
    },
    loading() {
      return this.$store.state.chat._fetchMessagesLoading;
    }
  },

  watch: {
    messages() {
      setTimeout(() => {
        this.scrollToLast();
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
      if (!this.$refs.messagesContainer) {
        return;
      }
      this.$refs.messagesContainer.$el.scrollTop = this.$refs.messagesContainer.$el.scrollHeight;
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
      if (message.isFree) {
        return;
      }
      if (process.env.VUE_APP_NAME === "avn") {
        if (!this.user.isPaymentCardConnected) {
          this.$store.dispatch(
            "global/flashToast",
            "You should add card in payment settings"
          );
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
    }
  },

  mounted() {
    setTimeout(() => {
      this.scrollToLast();
    }, 100);
  }
};
</script>

<style scoped>
.chatMessageSending {
  margin: 5px 5px 40px 5px;
  text-align: right;
}
</style>
