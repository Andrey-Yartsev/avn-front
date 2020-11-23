<template>
  <div
    id="chatCollectionContent"
    class="chatCollectionContent"
    :class="{
      chat: isSecondScreen,
      'no-chats': noActiveChats,
      'page-block': mode !== 'modal'
    }"
    @scroll="onScroll"
  >
    <template>
      <div class="chatHeader">
        <div class="contactsListHeader">
          <a
            :href="user.username ? `/${user.username}` : '/#'"
            class="avatar header-avatar"
            @click.prevent="openUserMobileBar"
            v-if="$mq === 'mobile'"
          >
            <span class="avatar__img">
              <img v-if="user.avatar" :src="user.avatar" />
            </span>
          </a>
          <h3 class="chat-title">Messages</h3>
          <div v-if="$mq === 'mobile'" class="massMessagesHistory-link">
            <a
              href="#"
              @click.prevent="showMassMessagesHistory"
              class="newMessage"
            >
              <span class="icn-clock icn-item icn-size_lg"></span>
            </a>
          </div>
          <div class="newMessage-link">
            <a
              href="/chat/new"
              @click.prevent="goTo('/chat/new')"
              class="newMessage"
              >New message
              <span class="icn-msg icn-item icn-size_lg"></span>
            </a>
          </div>
        </div>
        <MobileHeader activeName="chat" v-if="$mq === 'mobile'" />
      </div>
    </template>

    <div class="loader-container loader-container_center" v-if="loading">
      <Loader
        :fullscreen="false"
        class="main-chat-loader"
        :small="true"
        :fulllight="true"
      />
    </div>

    <div class="chatCollectionContent__col chatCollectionContent__col_narrow">
      <div class="chat-container">
        <slot name="col1"></slot>
      </div>
    </div>
    <div
      v-if="unreadCount && $mq === 'mobile' && !isNew && !isSecondScreen"
      class="new-post-toast show bg-gradient bg-gradient_standart unread-box"
      @click.prevent="markAsRead"
    >
      <span>Unread chats ({{ unreadCount }})</span
      ><a href="#" :disabled="markAsReadInProgress">Mark all as read</a>
    </div>
    <div class="chatCollectionContent__col chatCollectionContent__col_wide">
      <slot name="col2"></slot>
    </div>
    <slot name="extra"></slot>

    <Footer class="hidden-desktop" v-if="$mq === 'mobile'" />
  </div>
</template>

<script>
import ModalRouterParams from "@/mixins/modalRouter/params";
import User from "@/mixins/user";
import MobileHeader from "@/components/header/Mobile";
import Footer from "@/components/footer/Index.vue";
import StickyHeader from "@/mixins/stickyHeader";
import Loader from "@/components/common/Loader";

export default {
  name: "ChatWrapper",

  mixins: [ModalRouterParams, User, StickyHeader],

  components: {
    MobileHeader,
    Footer,
    Loader
  },

  computed: {
    loading() {
      return this.$store.state.chat.chatsLoading;
    },
    isSecondScreen() {
      if (this.$store.state.chat.isSecondScreen) {
        return true;
      }
      return !!parseInt(this.routeParams.userId);
    },
    isNew() {
      return (
        this.routePath === "chat/new" ||
        (this.$mq === "mobile" && this.$route.path === "/chat/new")
      );
    },
    routePath() {
      return this.$store.state.modalRouter.path;
    },
    noActiveChats() {
      if (this.$store.state.chat.chats.length) {
        return false;
      } else if (this.$store.state.chat.activeUserId) {
        return false;
      }
      return true;
    },
    unreadCount() {
      return this.$store.state.chat.unreadChatsCount;
    },
    markAsReadInProgress() {
      return this.$store.state.chat._markAllChatsAsReadLoading;
    }
  },

  methods: {
    openUserMobileBar() {
      this.$store.dispatch("global/openUserMobileBar");
    },
    markAsRead() {
      this.$store.dispatch("chat/markAllChatsAsRead");
    },
    showMassMessagesHistory() {
      this.$store.dispatch("modal/show", {
        name: "chatMassMessagesHistory"
      });
    }
  }
};
</script>
