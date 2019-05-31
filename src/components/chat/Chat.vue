<template>
  <Wrapper :mode="mode">
    <template slot="col1">
      <div
        class="chatCollectionContentWrapper chatCollectionContentWrapper_mob-height"
        v-if="!noMessages"
      >
        <ContactList
          :chats="chats"
          :mode="mode"
          :class="{ 'bg-contacts': $mq === 'desktop' }"
        />
      </div>
    </template>

    <template slot="col2">
      <div
        v-if="isHome"
        class="start-chat-wrapper"
        :class="{ 'hidden-mobile': hasActiveChats }"
      >
        <div class="chatHeader chatHeader_add-shadow no-nav">
          <div class="selectedChatHeader">
            You don't have any messages selected.
          </div>
        </div>
        <div class="chatCollectionContentWrapper">
          <div class="chatMessagesCollectionView">
            <div class="msg-no-chat">
              <div class="msg-no-chat__msg">
                Choose one of your existing message<br />or start
              </div>
              <span
                class="btn border md alt btn-start"
                @click="goTo('/chat/new')"
                >New message</span
              >
            </div>
          </div>
        </div>
      </div>
      <template v-else>
        <div class="chatCollectionContentWrapper" v-if="activeUserLoading">
          <Loader :fullscreen="false" text="" class="transparent small" />
        </div>
        <template v-else>
          <div
            class="chatHeader chatHeader_add-shadow no-nav"
            v-if="activeUser"
          >
            <div class="selectedChatHeader">
              <div
                class="back-popup-btn hidden-desktop"
                v-if="$mq === 'mobile'"
              >
                <span class="back" @click="mobileBack"></span>
              </div>
              <router-link
                :to="'/' + activeUser.username"
                class="avatar avatar_gap-r-md avatar_sm hidden-mobile"
              >
                <span class="avatar__img">
                  <img :src="activeUser.avatar" v-if="activeUser.avatar" />
                </span>
              </router-link>
              <div class="username-group">
                <router-link :to="'/' + activeUser.username" class="name">
                  {{ activeUser.name }}
                </router-link>
                <span class="verified-user" v-if="activeUser.isVerified"></span>
                <span class="user-login">
                  <router-link
                    class="username"
                    :to="'/' + activeUser.username"
                    >{{ activeUser.username }}</router-link
                  >
                </span>

                <div class="block-indicator">
                  <span class="user-login" v-if="blockLoading">...</span>
                  <span
                    class="icn-block icn-item"
                    v-else-if="activeUser.isBlocked"
                  ></span>
                </div>
              </div>

              <UserDropdown
                :activeUser="activeUser"
                :hasMessages="!!messages.length"
                :deleteInProgress="deleteInProgress"
                @deleteConversation="deleteConversation"
              />
            </div>
          </div>
          <div class="chatCollectionContentWrapper">
            <div class="chatMessagesCollectionView">
              <div
                class="chat-section chat-section_loading"
                v-if="messagesLoading"
              >
                <Loader :fullscreen="false" text="" class="transparent small" />
              </div>
              <template v-if="activeUser">
                <Messages
                  v-if="messages"
                  :_messages="messages"
                  :withUser="activeUser"
                />
                <AddMessage :withUser="activeUser" />
              </template>
            </div>
          </div>
        </template>
      </template>
    </template>
    <NoConversations v-if="noMessages" />
  </Wrapper>
</template>

<script>
import User from "@/mixins/user";
import Wrapper from "./Wrapper";
import ContactList from "./ContactList";
import Messages from "./Messages";
import AddMessage from "./AddMessage";
import NoConversations from "./NoConversations";
import Loader from "@/components/common/Loader";
import MobileHeader from "@/components/header/Mobile";
import ModalRouterParams from "@/mixins/modalRouter/params";
import UserHeader from "@/components/header/User";
import UserDropdown from "./UserDropdown";

let focusIntervalId = 0;

export default {
  name: "Chat",

  mixins: [User, ModalRouterParams],

  components: {
    Wrapper,
    Messages,
    AddMessage,
    NoConversations,
    Loader,
    MobileHeader,
    ContactList,
    UserHeader,
    UserDropdown
  },

  data() {
    return {
      isTyping: false,
      deleteInProgress: false,
      virtualChat: null
    };
  },

  computed: {
    isHome() {
      return this.routePath === "chat";
    },
    isNew() {
      return this.routePath === "chat/new";
    },
    noMessages() {
      return this.routePath === "chat/no-messages";
    },
    chats() {
      let chats = this.$store.state.chat.chats.map(v => {
        const copy = { ...v };
        if (Object.keys(copy.lastMessage).length === 0) {
          copy.lastMessage = null;
        }
        if (this.activeUserId === copy.id) {
          copy.active = true;
        }
        return copy;
      });
      if (this.virtualChat) {
        if (chats.find(v => v.withUser.id === this.virtualChat.withUser.id)) {
          return chats;
        }
        let virtualChat = Object.assign({}, this.virtualChat);
        virtualChat.active = !this.activeChat;
        chats.push(virtualChat);
      }
      chats = chats.sort((a, b) => {
        let d1, d2;
        if (a.lastMessage) {
          d1 = new Date(a.lastMessage.changedAt);
        } else if (a.changedAt) {
          d1 = a.changedAt;
        }
        if (b.lastMessage) {
          d2 = new Date(b.lastMessage.changedAt);
        } else if (b.changedAt) {
          d2 = b.changedAt;
        }
        if (!d1 || !d2) {
          return -1;
        }
        return d2 - d1;
      });
      return chats;
    },
    hasActiveChats() {
      return this.$store.state.chat.chats.some(v => v.hasHistory);
    },
    firstActiveChat() {
      return this.$store.state.chat.chats.find(v => v.hasHistory);
    },
    messages() {
      return this.$store.state.chat.messages;
    },
    activeUserId() {
      return parseInt(this.routeParams.userId);
    },
    activeChat() {
      return this.$store.state.chat.chats.find(v => v.id == this.activeUserId);
    },
    activeUser() {
      if (!this.activeChat) {
        return this.$store.state.chat.fetchActiveUserResult;
      }
      return this.activeChat.withUser;
    },
    messagesLoading() {
      return this.$store.state.chat.fetchMessagesLoading;
    },
    blockLoading() {
      return (
        this.$store.state.user.blockLoading ||
        this.$store.state.user.unblockLoading
      );
    },
    activeUserLoading() {
      return this.$store.state.chat.fetchActiveUserLoading;
    }
  },

  watch: {
    activeUserId(activeUserId) {
      this.$store.commit("chat/messages", []);
      if (!activeUserId) {
        this.virtualChat = null;
        this.$store.commit("chat/setActiveUserId", null);
        return;
      }
      this.$store.commit("chat/setActiveUserId", activeUserId);
      this.fetchMessages();
    }
  },

  methods: {
    deleteConversation() {
      this.deleteInProgress = true;
      this.$store.dispatch("chat/delete", this.activeUserId).then(() => {
        this.deleteInProgress = false;
        this.goTo("/chat");
      });
    },
    fetchMessages() {
      this.$store.dispatch("chat/fetchMessages", this.activeUserId);
    },
    mobileBack() {
      this.goTo("/chat");
    },
    openUserMobileBar() {
      this.$store.dispatch("global/openUserMobileBar");
    },
    initVirtualChat() {
      if (!this.activeChat) {
        const deletedUserChat = this.findDeletedUserChat(this.activeUserId);
        if (deletedUserChat) {
          this.virtualChat = { ...deletedUserChat };
          return;
        }
        this.$store
          .dispatch("chat/fetchActiveUser", this.activeUserId)
          .then(user => {
            this.virtualChat = {
              lastMessage: null,
              id: user.id,
              withUser: user,
              changedAt: new Date()
            };
          });
      }
    },
    findDeletedUserChat(userId) {
      return this.chats.find(v => v.id === userId && !v.withUser.id);
    },
    windowFocus() {
      if (!focusIntervalId) {
        this.$store.commit("chat/setActiveWindow", true);
        focusIntervalId = setInterval(() => {
          this.$store.dispatch("chat/markUnread");
        }, 1000);
      }
    },
    windowBlur() {
      this.$store.commit("chat/setActiveWindow", false);
      clearInterval(focusIntervalId);
      focusIntervalId = 0;
    }
  },

  created() {
    this.$store.commit("chat/messages", []);
    this.$store.dispatch("chat/fetchChats").then(() => {
      if (this.activeUserId) {
        this.$store.commit("chat/setActiveUserId", this.activeUserId);
        this.fetchMessages();
        this.initVirtualChat();
      }
    });
    window.addEventListener("focus", this.windowFocus);
    window.addEventListener("blur", this.windowBlur);
  },

  beforeDestroy() {
    this.$store.commit("chat/messages", []);
    this.$store.commit("chat/resetChats");
    window.removeEventListener("focus", this.windowFocus);
    window.removeEventListener("blur", this.windowBlur);
  }
};
</script>
