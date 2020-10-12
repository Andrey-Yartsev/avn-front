<template>
  <Modal :onClose="close">
    <div class="popup-container chat-popup" slot="content">
      <div
        class="content massMessagesHistoryModal"
        :class="{ 'content_column-mob': $mq === 'mobile' }"
      >
        <div class="popup-addPost__header hidden-mobile bg-gradient_light">
          Mass messages history

          <button
            type="button"
            class="close close_shift-t close_default icn-item icn-size_lg"
            @click="close"
          />
        </div>

        <div class="addPost-header">
          <button
            type="button"
            class="header-return-btn go-back go-back_times"
            @click="close"
          >
            <h1 class="category-name">
              Mass messages history
            </h1>
          </button>
        </div>
        <div class="messages__list chatMessagesCollectionView">
          <div class="chatMessageHistoryItem" v-for="v in messages" :key="v.id">
            <div class="chatMessageHistoryItem__info">
              <div class="chatMessageHistoryItem__info-text">
                <span class="semi-transparent">Message was sent </span
                ><span class="bold alt">{{ time(v.createdAt) }}</span
                ><br />
                <span class="semi-transparent">to </span
                ><span class="bold alt">{{ v.recipientsCount }}</span
                ><span class="semi-transparent"> recipients</span><br />
                <span class="semi-transparent">and currently was read by </span
                ><span class="bold alt">{{ v.openedCount }}</span
                ><span class="semi-transparent"> of them</span>
              </div>
              <div class="chatMessageHistoryItem__info-unsend">
                <button
                  :disabled="v.unsent"
                  type="button"
                  class="btn border alt btn_fix-width-md "
                  @click="unsend(v.id)"
                >
                  {{ v.unsent ? "Already was unsent" : "Unsend unopened" }}
                </button>
              </div>
            </div>
            <div class="chatMessage authorMessage">
              <div class="chatMessageWrapper">
                <div class="messageContent">
                  <div
                    class="messageWrapper"
                    :class="{
                      tipsMessage: v.paymentType,
                      'message-icon': v.paymentType,
                      mine: true,
                      snapchatMessage: v.isSnapchat
                    }"
                  >
                    <span
                      class="message rounded-corners"
                      :class="{
                        'message-locked': v.textLength && !v.showPaidMessageText
                      }"
                      v-if="v.textLength"
                    >
                      <span class="message__text" v-html="v.text" />
                      <SubscribeButton
                        v-if="v.registerLink"
                        :profile="v.fromUser"
                      />
                    </span>
                    <div class="media-chat" v-if="v.media.length">
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
                        v-else-if="
                          v.media.length && v.media[0].type === 'photo'
                        "
                        :message="v"
                        :images="v.media"
                      />
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
                    v-if="!v.isFree && v.isOpened && v.payedAt"
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
                      class="message-time__written"
                      v-if="v.lastMessageInGroup"
                    >
                      <span class="timeValue"
                        >Sent {{ time(v.createdAt) }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="loader-container" v-if="!allDataRecieved">
            <Loader :fullscreen="false" text="" :small="true" />
          </div>
          <div v-if="messages.length" ref="scrollObserver"></div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal/Index";
import Loader from "@/components/common/Loader";
import { fromNow } from "@/helpers/datetime";
import MediaAudio from "@/components/chat/media/Audio";
import MediaImagesList from "@/components/chat/media/ImagesList";
import MediaVideosList from "@/components/chat/media/VideosList";
import SubscribeButton from "@/components/subscription/Button";
import IntersectionObserver from "@/mixins/intersectionObserver";

export default {
  name: "ChatMassMessagesHistoryModal",
  components: {
    Modal,
    MediaAudio,
    MediaImagesList,
    MediaVideosList,
    SubscribeButton,
    Loader
  },
  mixins: [IntersectionObserver],
  computed: {
    messages() {
      return this.$store.state.chat.bulkHistory.messages;
    },
    allDataRecieved() {
      return this.$store.state.chat.bulkHistory.allDataReceived;
    }
  },
  methods: {
    close() {
      this.$store.dispatch("modal/hide", {
        name: "chatMassMessagesHistory"
      });
    },
    time(date) {
      return fromNow(date);
    },
    unsend(messageId) {
      console.log("unsend");
      this.$store
        .dispatch("chat/bulkHistory/unsendMessage", messageId)
        .then(() => {
          this.$store.dispatch("global/flashToast", {
            text: "Message unsent successfully"
          });
        });
    },
    fetchMessages() {
      this.$store.dispatch("chat/bulkHistory/getMessages").then(() => {
        this.isInitFetch = false;
        this.handleResponseWithIntersectionObserver(this.fetchMessages);
      });
    }
  },
  mounted() {
    this.fetchMessages();
  },
  beforeDestroy() {
    this.$store.commit("chat/bulkHistory/resetData");
  }
};
</script>
