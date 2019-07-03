<template>
  <div class="contactsList">
    <component
      :is="scrollableComponent"
      class="contactsListContent"
      ref="contactsList"
      @ps-scroll-y="psScroll"
    >
      <div
        @click="openChat(v.id)"
        class="chatView"
        v-for="v in chats"
        :key="v.id"
        :class="{
          active: v.active,
          unread: !!v.unreadMessagesCount,
          disabled: v.withUser.isMuted
        }"
      >
        <div class="avatar avatar_md">
          <span class="avatar__img">
            <img :src="v.withUser.avatar" v-if="v.withUser.avatar" />
          </span>
        </div>
        <div class="chatViewContent">
          <div class="chatView__header">
            <span class="name">{{ v.withUser.name }}</span>
            <span
              class="verified-user icn-item"
              v-if="v.withUser.isVerified"
            ></span>
            <span class="user-login"
              ><span class="username">{{ v.withUser.username }}</span></span
            >
            <div class="timestamp" v-if="v.lastMessage">
              {{ messageTime(v.lastMessage) }}
            </div>
          </div>
          <div class="chatView__body">
            <p class="typing">
              <template v-if="v.lastMessage">
                <span v-if="v.lastMessage.isTips" class="type-msg-icn"
                  ><span class="icn-tips icn-item"></span
                ></span>
                <span class="type-msg-icn" v-if="!v.lastMessage.isFree">
                  <span class="icn-locked icn-item"></span>
                </span>
                <span
                  v-else-if="v.lastMessage.media.length"
                  class="type-msg-icn"
                  ><span class="icn-media icn-item"></span
                ></span>
                <span v-else class="message semi-transparent">
                  <template>{{ stripHtml(v.lastMessage.text) }}</template>
                </span>
              </template>
              <span class="isTyping">tester is typing...</span>
            </p>
          </div>
        </div>
      </div>
    </component>
  </div>
</template>

<script>
import { fromNow } from "@/helpers/datetime";
import ModalRouterGoto from "@/mixins/modalRouter/goto";
import InfinityScrollData from "@/mixins/infinityScrollData";

export default {
  name: "ChatContactList",

  mixins: [ModalRouterGoto, InfinityScrollData],

  computed: {
    scrollableComponent() {
      return this.$mq === "mobile" ? "div" : "perfect-scrollbar";
    },
    store() {
      return this.$store.state.chat;
    }
  },

  props: {
    chats: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    loadingName: "_fetchChatsLoading",
    mobileContainer: null
  }),

  methods: {
    openChat(id) {
      this.goTo("/chat/" + id);
    },
    messageTime(message) {
      return fromNow(message.changedAt);
    },
    stripHtml(html) {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    },
    infinityScrollGetDataMethod() {
      this.$store.dispatch("chat/fetchChats");
    },
    psScroll() {
      this.scrollHandler();
    },
    _scrollHandler(el, offset) {
      if (this.infinityScrollTimeoutId) {
        clearTimeout(this.infinityScrollTimeoutId);
      }

      this.infinityScrollTimeoutId = setTimeout(() => {
        const isOnBottom = el.scrollTop > el.offsetHeight - offset;

        if (
          isOnBottom &&
          !this.infinityScrollLoading &&
          !this.allDataReceived
        ) {
          this.infinityScrollGetDataMethod();
        }
      }, 100);
    },
    scrollHandler() {
      this._scrollHandler(this.$refs.contactsList.$el, 50);
    },
    mobileScrollHandler(e) {
      this._scrollHandler(e.target, 200);
    }
  },
  mounted() {
    this.mobileContainer = document.getElementById("chatCollectionContent");
    this.mobileContainer.addEventListener("scroll", e => {
      this.mobileScrollHandler(e);
    });
  }
};
</script>
