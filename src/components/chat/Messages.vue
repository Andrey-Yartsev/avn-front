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
        <ChatMessage
          v-for="message in messages"
          v-bind:key="message.id"
          :message="message"
          :withUser="withUser"
          @setEditableMessage="setEditableMessage"
        />

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
import { intervalToDuration } from "date-fns";
import ChatMessage from "./Message";

const bottomThreshold = 100; // pixels left to bottom of container

export default {
  name: "ChatMessages",

  components: {
    Loader,
    ChatMessage
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
      //skip counter update if message has been deleted
      if (this.$store.state.chat.skipNewMessagesCounter) {
        this.$store.commit("chat/resetSkipNewMessagesCounter");
        return;
      }
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
            if (messagesCount) {
              this.$store.dispatch(
                "chat/incrementUnreadMessagesCount",
                this.withUser.id
              );
            }
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
        const now = new Date();
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

          let current = new Date(messages[i].createdAt);
          let oldMessage =
            intervalToDuration({ start: current, end: now }).days > 0;

          if (messages[i + 1]) {
            if (messages[i].fromUser.id !== messages[i + 1].fromUser.id) {
              nextAuthorChanges = true;
            }

            let next = new Date(messages[i + 1].createdAt);
            let days =
              intervalToDuration({ start: current, end: next }).days > 0;
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
                let current = new Date(messages[i].createdAt);
                let last = new Date(lastDate);

                lastDate = messages[i].createdAt;

                let duration = intervalToDuration({
                  start: last,
                  end: current
                });

                let days = duration.days;
                let hours = duration.hours;
                let minutes = duration.minutes;

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
      this.$refs.messagesMobileContainer.addEventListener(
        "scroll",
        this.scrollHandle
      );
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
    },
    setEditableMessage(message) {
      this.$emit("setEditableMessage", message);
    }
  },
  mounted() {
    setTimeout(() => {
      this.scrollToLast();
    }, 100);
  },
  beforeDestroy() {
    this.$refs.messagesMobileContainer?.removeEventListener(
      "scroll",
      this.scrollHandle
    );
  }
};
</script>
