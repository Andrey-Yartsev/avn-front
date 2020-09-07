<template>
  <div class="chat-section">
    <div
      v-if="!loading && unreadMessagesCount"
      class="new-post-toast bg-gradient bg-gradient_standart show unread-box"
    >
      <span>Unread ({{ unreadMessagesCount }})</span
      ><a href="#" @click.prevent="markAllAsRead">Mark All as Read</a>
    </div>
    <div
      class="loader-container loader-container_center"
      v-if="loading || !loaderHidden"
    >
      <Loader :fullscreen="false" :small="true" :fulllight="true" />
    </div>
    <component
      :is="scrollableComponent"
      v-show="!loading"
      class="chat-wrapper"
      :class="{ 'm-with-unread': !loading && unreadMessagesCount }"
      ref="messagesContainer"
      @ps-scroll-y="psScrollHandle"
    >
      <div
        class="chat-scrollbar"
        ref="messagesMobileContainer"
        :class="{ 'chat-scrollbar_gap': allMessagesLoaded }"
      >
        <div
          class="chatFlatLoader past-messages semi-transparent"
          v-if="moreLoading"
        >
          Loading history...
        </div>
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
            <div class="messageContent" :style="{ fontSize: chatFontsize }">
              <div
                class="messageWrapper"
                :class="{
                  tipsMessage: v.paymentType,
                  lockedMessage: isLocked(v),
                  unlockedMessage: isUnlocked(v),
                  'message-icon': isLocked(v) || v.paymentType || !isLocked(v),
                  mine: isMyMessage(v),
                  snapchatMessage: v.isSnapchat
                }"
                @click="messageClick(v)"
              >
                <span
                  class="message rounded-corners"
                  :class="{
                    'message-locked':
                      v.textLength && isLocked(v) && !v.showPaidMessageText
                  }"
                  v-if="v.textLength"
                >
                  <span class="message__text" v-html="text(v)" />
                  <span
                    class="message-locked__text"
                    v-if="v.textLength && isLocked(v) && !isMyMessage(v)"
                    >{{ lockedText(v) }}</span
                  >
                  <SubscribeButton
                    v-if="v.registerLink"
                    :profile="v.fromUser"
                  />
                </span>
                <span
                  v-if="
                    v.textLength &&
                      v.price &&
                      !v.showPaidMessageText &&
                      isLocked(v) &&
                      !isMyMessage(v)
                  "
                  class="message-locked__price"
                >
                  {{ v.price }}
                </span>
                <div class="media-chat" v-if="v.media.length">
                  <span
                    v-if="v.price && isLocked(v) && !isMyMessage(v)"
                    class="media-chat__price"
                    >Price: {{ v.price }}</span
                  >
                  <!-- <MediaVideo
                    v-if="v.media.length && v.media[0].type === 'video'"
                    :message="v"
                    :ref="'video' + v.id"
                    @play="stopOtherVideo(v.id)"
                  /> -->
                  <MediaAudio
                    v-if="v.media.length && v.media[0].type === 'audio'"
                    :message="v"
                  />
                  <MediaVideosList
                    v-if="v.media.length && v.media[0].type === 'video'"
                    :message="v"
                    :videos="v.media"
                  />
                  <MediaImagesList
                    v-else-if="v.media.length && v.media[0].type === 'photo'"
                    :message="v"
                    :images="v.media"
                  />
                  <!-- <MediaImage
                    v-else-if="v.media.length && v.media[0].type === 'photo'"
                    :message="v"
                    ref="img"
                  /> -->
                </div>
                <template v-if="v.story">
                  <div class="media-chat">
                    <div class="media media-item">
                      <figure
                        class="media-item active media-item_photo"
                        data-index="0"
                      >
                        <span class="postLink">
                          <img
                            :src="v.story.preview"
                            class="media-content m-cover-size"
                          />
                        </span>
                      </figure>
                    </div>
                  </div>
                </template>
                <template v-if="v.messageAttachment">
                  <a
                    :href="vv.url"
                    target="_blank"
                    class="userView userView_card rounded-corners nolink"
                    v-for="(vv, k) in v.messageAttachment"
                    :key="k"
                  >
                    <div class="bg bg-color bg-gradient_light">
                      <img v-if="vv.image" :src="vv.image" />
                    </div>
                    <div class="user-container">
                      <div class="names-actions-wrapper">
                        <div class="user-names">
                          <div class="wrap-name" v-html="vv.title"></div>
                        </div>
                      </div>
                      <p
                        class="profile-text"
                        v-if="vv.description"
                        v-html="vv.description"
                      ></p>
                      <div class="link-render">
                        <a>{{ vv.url }}</a>
                      </div>
                    </div>
                  </a>
                </template>
              </div>
              <div
                v-if="isMyMessage(v) && !v.isFree && v.isOpened && v.payedAt"
                class="timestamp timestamp_sm-size message-time test"
              >
                <div class="message-time__written">
                  <span class="timeValue"
                    >Paid {{ v.price }} {{ time(v.payedAt) }}</span
                  >
                </div>
              </div>
              <div class="timestamp timestamp_sm-size message-time">
                <div
                  class="message-time__read"
                  v-if="isMyMessage(v) && v.readDate && v.lastMessageInGroup"
                >
                  <span class="timeValue">Read {{ time(v.readDate) }}</span>
                  <span class="icn-read icn-item" />
                </div>
                <div class="message-time__written" v-if="v.lastMessageInGroup">
                  <span class="timeValue">Sent {{ time(v.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="typing semi-transparent" v-if="typing">
          <span>User is typing...</span>&nbsp;
        </div>

        <div
          class="chatFlatLoader new-messages semi-transparent"
          v-if="sending"
        >
          Sending...
        </div>
      </div>
    </component>
  </div>
</template>

<script>
import userMixin from "@/mixins/user";
import Loader from "@/components/common/Loader";
import { fromNow } from "@/helpers/datetime";
import MediaImage from "./media/Image";
import MediaAudio from "./media/Audio";
import MediaImagesList from "./media/ImagesList";
import MediaVideosList from "./media/VideosList";
import MediaVideo from "./media/VideoPreview";
import SubscribeButton from "@/components/subscription/Button";
import moment from "moment";

const bottomThreshold = 100; // pixels left to bottom of container

export default {
  name: "ChatMessages",

  components: {
    Loader,
    MediaImage,
    MediaVideo,
    SubscribeButton,
    MediaImagesList,
    MediaVideosList,
    MediaAudio
  },

  mixins: [userMixin],

  props: {
    withUser: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      scrollTimeoutId: 0,
      loaderHidden: false,
      scrollPosition: 0
    };
  },

  computed: {
    scrollableComponent() {
      return this.$mq === "mobile" ? "div" : "perfect-scrollbar";
    },
    chatFontsize() {
      return this.$store.state.chat.fontSize + "px";
    },
    container() {
      if (this.$mq === "mobile") {
        return this.$refs.messagesMobileContainer;
      } else if (
        this.$refs.messagesContainer &&
        this.$refs.messagesContainer.$el
      ) {
        return this.$refs.messagesContainer.$el;
      } else return null;
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
    _messages() {
      return this.$store.state.chat.messages;
    },
    loading() {
      return this.$store.state.chat._fetchMessagesLoading;
    },
    moreLoading() {
      return this.$store.state.chat._fetchMoreMessagesLoading;
    },
    allMessagesLoaded() {
      return this.$store.state.chat.allMessagesLoaded;
    },
    fetchingOld() {
      return this.$store.state.chat.fetchingOld;
    },
    typing() {
      return this.$store.state.chat.typing.indexOf(this.withUser.id) !== -1;
    },
    currentChat() {
      return this.$store.state.chat.chats.find(
        v => v.withUser.id === this.withUser.id
      );
    },
    unreadMessagesCount() {
      if (!this.currentChat) {
        return null;
      }
      return this.currentChat.unreadMessagesCount;
    }
  },

  watch: {
    loading: {
      immediate: true,
      handler(loading) {
        if (!loading) {
          this.$nextTick(() => {
            this.loaderHidden = true;
            this.initMobileScroll();
            this.scrollToLast();
          });
        }
      }
    },
    sending() {
      // sending changed 2 times, before sending and after
      // 1st time scroll to message Sending, 2nd time scroll to new messsage
      this.scrollToLast();
    },
    messages(value, oldValue) {
      // count added messages
      let messagesCount = value.length - oldValue.length;
      let lastMessage;
      let lastMessageIsMine;

      switch (messagesCount) {
        case 0: // second part of media message replaced previous message
        case 1: // new message has arrived
          lastMessage = value[value.length - 1];
          if (lastMessage) {
            lastMessageIsMine = lastMessage.fromUser.id === this.user.id;

            if (lastMessageIsMine) {
              this.$nextTick(() => {
                this.scrollToLast(true);
              });
            }
          }

          // if we at bottom of chat messages, do scrollToLast
          if (this.isBottom()) {
            this.$nextTick(() => {
              this.scrollToLast();
            });
            this.$store.dispatch("chat/markChatAsViewed", this.withUser.id);
          } else {
            // if we are not at bottom, increment unreadMessagesCount
            this.$store.dispatch(
              "chat/incrementUnreadMessagesCount",
              this.withUser.id
            );
          }
          break;
        default:
          // fetched more messages (message history), restore scroll position
          this.$nextTick(() => {
            this.restoreScrollPosition();
          });
          break;
      }
    }
  },

  methods: {
    isAuthor(message) {
      return message.fromUser.id === this.user.id;
    },
    text(message) {
      if (!message.paymentType) {
        return message.text;
      } else {
        let text = "";
        switch (message.paymentType) {
          case "tip":
            text = this.isAuthor(message)
              ? `You have tipped ${this.withUser.name} for ${message.text}`
              : `You have been tipped ${message.text}`;
            break;
          case "paidUnblock":
            text = this.isAuthor(message)
              ? `You have paid ${message.text} for ${
                  this.withUser.name
                } to unblock the account`
              : `${message.fromUser.name} paid ${
                  message.text
                } to unblock the account`;
            break;
          default:
            break;
        }
        return text;
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
          // If current message is mine but not previous message set firstMessageInGroup flag
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
      let lastDate = null;

      // if only one message
      if (messages.length === 1) {
        messages[messages.length - 1].lastMessageInGroup = true;
      } else {
        const now = moment();
        for (let i = 0; i < messages.length; i++) {
          // if very last message
          if (i === messages.length - 1) {
            messages[i].lastMessageInGroup = true;
            return messages;
          }

          // groping by data
          let currentIsMine = this.checkAuthor(messages[i].fromUser);
          let nextIsMine = this.checkAuthor(messages[i + 1].fromUser);
          let nextAuthorChanges = false;
          let prevAuthorChanges = false;
          let nextDayChanges = false;

          let current = moment(messages[i].createdAt);
          let diffTime2 = now.diff(current);
          let oldMessage = moment.duration(diffTime2).days() > 0;

          if (messages[i + 1]) {
            if (messages[i].fromUser.id !== messages[i + 1].fromUser.id) {
              nextAuthorChanges = true;
            }

            let next = moment(messages[i + 1].createdAt);

            let diffTime = next.diff(current);
            let duration = moment.duration(diffTime);

            let days = duration.days();
            if (days > 0) {
              nextDayChanges = true;
            }
          }
          if (messages[i - 1]) {
            if (messages[i].fromUser.id !== messages[i - 1].fromUser.id) {
              prevAuthorChanges = true;
            }
          }

          if (messages[i - 1]) {
            if (!prevAuthorChanges) {
              if (lastDate) {
                // check for new day
                let current = moment(messages[i].createdAt);
                let last = moment(lastDate);

                lastDate = messages[i].createdAt;

                let diffTime = current.diff(last);
                let duration = moment.duration(diffTime);

                let days = duration.days();
                let hours = duration.hours();
                let minutes = duration.minutes();

                if (nextDayChanges) {
                  messages[i].lastMessageInGroup = true;
                  messages[i].diffDays = days;
                  continue;
                }

                if (!oldMessage) {
                  if (minutes > 10 && minutes < 30) {
                    messages[i].lastMessageInGroup = true;
                    continue;
                  }
                  if (hours > 2) {
                    messages[i].lastMessageInGroup = true;
                    continue;
                  }
                }
              } else {
                lastDate = messages[i].createdAt;
              }
            } else {
              lastDate = null;
            }
          } else {
            lastDate = null;
          }

          if (nextAuthorChanges) {
            lastDate = null;
          }
          // -------- end of groping by data

          // If current message is mine but not next message OR current message is not mine but next one is mine - set lastMessageInGroup flag
          if (
            (currentIsMine && !nextIsMine) ||
            (!currentIsMine && nextIsMine)
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
    isBottom() {
      if (this.container) {
        return (
          this.container.scrollTop >
          this.container.scrollHeight -
            this.container.clientHeight -
            bottomThreshold
        );
      }
      return true;
    },
    scrollToLast(forceScroll) {
      if (this.fetchingOld && !forceScroll) {
        //
      } else {
        if (this.container) {
          this.container.scrollTop = this.container.scrollHeight;
        }
      }
    },
    time(date) {
      return fromNow(date);
    },
    time2(date) {
      return moment(date).format("DD/MM HH:mm:ss");
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
        // if (!this.user.isPaymentCardConnected) {
        //   this.$store.dispatch("global/flashToast", {
        //     text: "You should add card in payment settings",
        //     type: "warning"
        //   });
        //   this.$router.push("/settings/payments");
        //   return;
        // }

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
    _scrollHandler() {
      this.saveScrollPosition();
      // if scrolled to most bottom markChatAsViewed
      if (this.isBottom()) {
        this.$store.dispatch("chat/markChatAsViewed", this.withUser.id);
      }
      if (this.container.scrollTop > 150) return;
      if (this.moreLoading) {
        return;
      }
      if (this.allMessagesLoaded) {
        return;
      }
      this.fetchMoreMessages();
    },
    psScrollHandle() {
      this.scrollHandle(false);
    },
    scrollHandle() {
      clearTimeout(this.scrollTimeoutId);
      this.scrollTimeoutId = setTimeout(() => this._scrollHandler(), 100);
    },
    initMobileScroll() {
      this.$refs.messagesMobileContainer.addEventListener("scroll", () => {
        this.scrollHandle();
      });
    },
    saveScrollPosition() {
      this.scrollPosition =
        this.container.scrollHeight -
        this.container.scrollTop -
        this.container.clientHeight;
    },
    restoreScrollPosition() {
      this.container.scrollTop =
        this.container.scrollHeight -
        this.container.clientHeight -
        this.scrollPosition;
    },
    fetchMoreMessages() {
      this.$store.dispatch("chat/fetchMoreMessages", this.withUser.id);
    },
    markAllAsRead() {
      this.$store.dispatch("chat/markAllMessagesAsRead", this.withUser.id);
    }
  },
  mounted() {
    setTimeout(() => {
      this.scrollToLast();
    }, 100);
  }
};
</script>
