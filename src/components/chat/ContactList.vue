<template>
  <div class="contactsList" :class="{ 'has-unread': !!unreadCount }">
    <div
      v-if="unreadCount && $mq === 'desktop'"
      class="new-post-toast show bg-gradient bg-gradient_standart unread-box"
      @click.prevent="markAsRead"
    >
      <span>Unread chats ({{ unreadCount }})</span
      ><a href="#" :disabled="markAsReadInProgress">Mark all as read</a>
    </div>
    <div class="filter-tab" v-if="unreadCount">
      <a
        href="#"
        :class="{ selected: filter === 'all' }"
        @click.prevent="setFilter('all')"
        >All</a
      >
      <a
        href="#"
        :class="{ selected: filter === 'unread' }"
        @click.prevent="setFilter('unread')"
        >Unread</a
      >
    </div>
    <component
      :is="scrollableComponent"
      class="contactsListContent"
      ref="contactsList"
      @ps-scroll-y="psScroll"
    >
      <div
        @click="openChat(v.id)"
        class="chatView"
        v-for="v in _chats"
        :key="v.id"
        :class="{
          active: v.active,
          unread: !!v.unreadMessagesCount,
          disabled: v.withUser.isMuted || !v.withUser.active
        }"
      >
        <div
          class="avatar avatar_md"
          :class="{ 'online-state': isOnline(v.withUser.id) }"
        >
          <span class="avatar__img">
            <img :src="v.withUser.avatar" v-if="v.withUser.avatar" />
          </span>
        </div>
        <div class="chatViewContent">
          <div class="chatView__header">
            <span class="name">{{ v.withUser.name }}</span>
            <span
              class="icn-item icn-tips"
              v-if="v.withUser.isSubscribed"
            ></span>
            <span
              class="verified-user icn-item"
              :class="{
                fullyMonetized:
                  v.withUser.canEarn && v.withUser.canPayoutsRequest
              }"
              v-if="
                v.withUser.isVerified ||
                  (v.withUser.canEarn && v.withUser.canPayoutsRequest)
              "
            ></span>
            <span class="user-login">
              <span class="username">{{ v.withUser.username }}</span>
            </span>
            <div class="timestamp" v-if="v.lastMessage">
              {{ messageTime(v.lastMessage) }}
            </div>
          </div>
          <div class="chatView__body">
            <p class="typing">
              <template v-if="isTyping(v.withUser.id)">
                <span class="message semi-transparent">User is typing...</span>
              </template>
              <template v-else-if="v.lastMessage">
                <span v-if="v.lastMessage.isTips" class="type-msg-icn">
                  <span class="icn-tips icn-item"></span>
                </span>
                <span class="type-msg-icn" v-if="!v.lastMessage.isFree">
                  <span class="icn-locked icn-item"></span>
                </span>
                <span
                  v-else-if="v.lastMessage.media.length"
                  class="type-msg-icn"
                >
                  <span class="icn-media icn-item"></span>
                  <span
                    v-if="v.lastMessage.textLength > 0"
                    class="message semi-transparent"
                    v-html="v.lastMessage.text"
                  ></span>
                </span>
                <span
                  v-else
                  class="message semi-transparent"
                  v-html="v.lastMessage.text"
                ></span>
              </template>
              <span class="isTyping">tester is typing...</span>
            </p>
          </div>
          <button class="chat-tooltip-close"></button>
        </div>
      </div>
      <div
        class="chatFlatLoader past-messages semi-transparent"
        v-if="moreLoading"
      >
        Loading history...
      </div>
    </component>
  </div>
</template>

<script>
import { fromNow } from "@/helpers/datetime";
import ModalRouterGoto from "@/mixins/modalRouter/goto";
import InfinityScrollData from "@/mixins/infinityScrollData";
import User from "@/mixins/user";

export default {
  name: "ChatContactList",
  mixins: [User, ModalRouterGoto, InfinityScrollData],
  props: {
    chats: {
      type: Array,
      required: true
    },
    onlyUnread: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _chats() {
      if (!this.onlyUnread) {
        return this.chats;
      }
      return this.chats.filter(v => !!v.unreadMessagesCount);
    },
    scrollableComponent() {
      return this.$mq === "mobile" ? "div" : "perfect-scrollbar";
    },
    store() {
      return this.$store.state.chat;
    },
    moreLoading() {
      return this.$store.state.chat.moreChatsLoading;
    },
    showMarkAsReed() {
      return this.$store.state.chat.showMarkAsReedForContacts;
    },
    unreadCount() {
      return this.$store.state.chat.unreadChatsCount;
    },
    markAsReadInProgress() {
      return this.$store.state.chat._markAllChatsAsReadLoading;
    },
    filter() {
      return this.$store.state.chat.chatsFilter;
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
      return fromNow(message.createdAt);
    },
    stripHtml(html) {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    },
    infinityScrollGetDataMethod() {
      this.$store.dispatch("chat/fetchChats", false);
    },
    psScroll() {
      this.scrollHandler();
    },
    _scrollHandler(el) {
      if (this.infinityScrollTimeoutId) {
        clearTimeout(this.infinityScrollTimeoutId);
      }

      this.infinityScrollTimeoutId = setTimeout(() => {
        const isOnBottom =
          el.scrollTop > el.scrollHeight - el.offsetHeight - 50;

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
      this._scrollHandler(this.$refs.contactsList.$el);
    },
    mobileScrollHandler(e) {
      this._scrollHandler(e.target);
    },
    isTyping(id) {
      return this.$store.state.chat.typing.indexOf(id) !== -1;
    },
    markAsRead() {
      this.$store.dispatch("chat/markAllChatsAsRead");
    },
    setFilter(filter) {
      this.$store.commit("chat/setChatsFilter", filter);
    }
  },
  watch: {
    filter() {
      this.goTo("chat");
      this.$store.commit("chat/fetchChatsReset");
      this.$store.dispatch("chat/fetchChats", true);
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
