<template>
  <div class="chat-section">
    <Loader
      v-if="loading || !loaderHidden"
      :fullscreen="false"
      text=""
      class="small solid"
    />
    <component
      :is="scrollableComponent"
      v-show="!loading"
      class="chat-wrapper"
      ref="messagesContainer"
      @ps-scroll-y="psScrollHandle"
    >
      <div class="chat-scrollbar" ref="messagesMobileContainer">
        <div class="chatMessageSending loader-container" v-if="moreLoading">
          <Loader
            :fullscreen="false"
            text=""
            class="transparent small no-text"
          />
          <span class="loader-history-text semi-transparent"
            >Loading history...</span
          >
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
                  class="message rounded-corners"
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
                <div class="media-chat" v-if="v.media.length">
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
                class="timestamp timestamp_sm-size message-time"
                v-if="v.lastMessageInGroup"
              >
                <span class="status" v-if="isAuthor(v)"
                  >{{ v.isNew ? "Sent" : "Seen" }}
                </span>

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
import Loader from "@/components/common/Loader";
import { fromNow } from "@/helpers/datetime";
import MediaImage from "./media/Image";
import MediaVideo from "./media/Video";
import moment from "moment";

export default {
  name: "ChatMessages",

  components: {
    Loader,
    MediaImage,
    MediaVideo
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
      loaderHidden: false
    };
  },

  computed: {
    scrollableComponent() {
      return this.$mq === "mobile" ? "div" : "perfect-scrollbar";
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
    }
  },

  watch: {
    messages() {
      setTimeout(() => {
        this.scrollToLast();
        this.loaderHidden = true;
        if (this.$refs.img) {
          this.$refs.img.forEach(img => {
            img.$el.getElementsByTagName("img")[0].onload = () => {
              this.scrollToLast();
            };
          });
        }
      }, 100);
    },
    loading(loading) {
      if (!loading) {
        setTimeout(() => {
          this.initMobileScroll();
        }, 100);
      }
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

          let current = moment(messages[i].changedAt);
          let diffTime2 = now.diff(current);
          let oldMessage = moment.duration(diffTime2).days() > 0;

          if (messages[i + 1]) {
            if (messages[i].fromUser.id !== messages[i + 1].fromUser.id) {
              nextAuthorChanges = true;
            }

            let next = moment(messages[i + 1].changedAt);

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
                let current = moment(messages[i].changedAt);
                let last = moment(lastDate);

                lastDate = messages[i].changedAt;

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
                lastDate = messages[i].changedAt;
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
    scrollToLast() {
      if (this.fetchingOld) {
        //
      } else {
        if (this.$mq === "mobile") {
          if (this.$refs.messagesMobileContainer) {
            this.$refs.messagesMobileContainer.scrollTop = this.$refs.messagesMobileContainer.scrollHeight;
          }
        } else {
          if (
            this.$refs.messagesContainer &&
            this.$refs.messagesContainer.$el
          ) {
            this.$refs.messagesContainer.$el.scrollTop = this.$refs.messagesContainer.$el.scrollHeight;
          }
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
    },
    _scrollHandler(mobile) {
      if (mobile) {
        if (this.$refs.messagesMobileContainer.scrollTop > 150) {
          return;
        }
      } else {
        if (this.$refs.messagesContainer.$el.scrollTop > 150) {
          return;
        }
      }
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
    scrollHandle(mobile) {
      clearTimeout(this.scrollTimeoutId);
      this.scrollTimeoutId = setTimeout(() => this._scrollHandler(mobile), 500);
    },
    initMobileScroll() {
      this.$refs.messagesMobileContainer.addEventListener("scroll", () => {
        this.scrollHandle(true);
      });
    },
    fetchMoreMessages() {
      this.$store.dispatch("chat/fetchMoreMessages", this.withUser.id);
    }
  },

  mounted() {
    setTimeout(() => {
      this.scrollToLast();
    }, 100);
  }
};
</script>
